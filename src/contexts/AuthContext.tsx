import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { hashPassword, verifyPassword } from "@/lib/authCrypto";

export type UserRole = "user" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  canPostArticles: boolean;
}

type LegacyAccount = {
  name: string;
  password: string;
};

type SecureAccount = {
  name: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  canPostArticles: boolean;
};

type StoredAccount = LegacyAccount | SecureAccount;

function isSecureAccount(a: StoredAccount): a is SecureAccount {
  return "passwordHash" in a && "salt" in a;
}

/** Farmer = community member; Administrator = full access including user management. */
export type SignupAccountType = "farmer" | "admin";

interface AuthContextType {
  user: AuthUser | null;
  signup: (
    name: string,
    email: string,
    password: string,
    accountType: SignupAccountType
  ) => Promise<{ success: true } | { success: false; error: string }>;
  login: (email: string, password: string) => Promise<{ success: true } | { success: false; error: string }>;
  logout: () => void;
  listUsers: () => { email: string; name: string; role: UserRole; canPostArticles: boolean }[];
  setUserCanPost: (email: string, canPost: boolean) => { success: true } | { success: false; error: string };
}

const USERS_KEY = "agrilearn_auth_users";
const SESSION_KEY = "agrilearn_auth_session";
/** After this runs once, new sign-ups persist. Delete this key in DevTools if you need to wipe everything again. */
const FULL_CLEAR_MARKER_KEY = "agrilearn_auth_full_clear_v2";

function wipeAllAuthStorageIfFirstRunAfterClear() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(FULL_CLEAR_MARKER_KEY)) return;
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.setItem(FULL_CLEAR_MARKER_KEY, "1");
  } catch {
    /* ignore */
  }
}

wipeAllAuthStorageIfFirstRunAfterClear();

function loadUsers(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StoredAccount>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredAccount>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hasExistingAdmin(): boolean {
  const users = loadUsers();
  for (const acc of Object.values(users)) {
    if (isSecureAccount(acc) && acc.role === "admin") return true;
  }
  return false;
}

function sessionFromSecure(email: string, acc: SecureAccount): AuthUser {
  return {
    name: acc.name,
    email: email.toLowerCase(),
    role: acc.role,
    canPostArticles: acc.canPostArticles,
  };
}

function writeSession(user: AuthUser | null) {
  if (!user) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<AuthUser>;
    if (!s?.email || !s?.name) return null;
    const key = s.email.toLowerCase();
    const users = loadUsers();
    const acc = users[key];
    if (acc && isSecureAccount(acc)) {
      return sessionFromSecure(key, acc);
    }
    if (typeof s.role === "string" && typeof s.canPostArticles === "boolean") {
      return s as AuthUser;
    }
    return {
      name: s.name,
      email: key,
      role: "user",
      canPostArticles: false,
    };
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readSession());

  const signup = useCallback(async (name: string, email: string, password: string, accountType: SignupAccountType) => {
    const key = email.trim().toLowerCase();
    if (!key || !password) {
      return { success: false as const, error: "Please fill in all fields." };
    }
    if (password.length < 8) {
      return { success: false as const, error: "Password must be at least 8 characters." };
    }
    if (accountType === "admin" && hasExistingAdmin()) {
      return {
        success: false as const,
        error: "An administrator is already registered. Sign up as a farmer, or log in with the admin account.",
      };
    }
    const users = loadUsers();
    if (users[key]) {
      return { success: false as const, error: "An account with this email already exists. Log in instead." };
    }
    const { passwordHash, salt } = await hashPassword(password);
    const isAdmin = accountType === "admin";
    users[key] = {
      name: name.trim(),
      passwordHash,
      salt,
      role: isAdmin ? "admin" : "user",
      canPostArticles: isAdmin,
    };
    saveUsers(users);
    const session = sessionFromSecure(key, users[key] as SecureAccount);
    setUser(session);
    writeSession(session);
    return { success: true as const };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const key = email.trim().toLowerCase();
    if (!key || !password) {
      return { success: false as const, error: "Please enter email and password." };
    }
    const users = loadUsers();
    const account = users[key];
    if (!account) {
      return { success: false as const, error: "No account found for this email. Sign up first." };
    }

    if (!isSecureAccount(account)) {
      if (account.password !== password) {
        return { success: false as const, error: "Incorrect password. Try again." };
      }
      const { passwordHash, salt } = await hashPassword(password);
      const migrated: SecureAccount = {
        name: account.name,
        passwordHash,
        salt,
        role: "user",
        canPostArticles: false,
      };
      users[key] = migrated;
      saveUsers(users);
      const session = sessionFromSecure(key, migrated);
      setUser(session);
      writeSession(session);
      return { success: true as const };
    }

    const ok = await verifyPassword(password, account.salt, account.passwordHash);
    if (!ok) {
      return { success: false as const, error: "Incorrect password. Try again." };
    }
    const session = sessionFromSecure(key, account);
    setUser(session);
    writeSession(session);
    return { success: true as const };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeSession(null);
  }, []);

  const listUsers = useCallback(() => {
    const users = loadUsers();
    return Object.entries(users).map(([email, acc]) => {
      if (isSecureAccount(acc)) {
        return {
          email,
          name: acc.name,
          role: acc.role,
          canPostArticles: acc.canPostArticles,
        };
      }
      return {
        email,
        name: acc.name,
        role: "user" as const,
        canPostArticles: false,
      };
    });
  }, []);

  const setUserCanPost = useCallback(
    (email: string, canPost: boolean) => {
      const current = user;
      if (!current || current.role !== "admin") {
        return { success: false as const, error: "Only administrators can change posting permissions." };
      }
      const key = email.trim().toLowerCase();
      if (key === current.email.toLowerCase()) {
        return { success: false as const, error: "You cannot change your own permissions here." };
      }
      const users = loadUsers();
      const acc = users[key];
      if (!acc || !isSecureAccount(acc)) {
        return { success: false as const, error: "User not found." };
      }
      if (acc.role === "admin") {
        return { success: false as const, error: "Admin accounts always have full access." };
      }
      users[key] = { ...acc, canPostArticles: canPost };
      saveUsers(users);
      return { success: true as const };
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, listUsers, setUserCanPost }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function canUserPostArticles(u: AuthUser | null): boolean {
  if (!u) return false;
  return u.role === "admin" || u.canPostArticles;
}
