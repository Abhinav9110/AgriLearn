import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MessageKey } from "@/i18n/messages";

const NAV_LINKS: { key: MessageKey; path: string }[] = [
  { key: "nav.home", path: "/" },
  { key: "nav.articles", path: "/articles" },
  { key: "nav.cropGuide", path: "/crop-guide" },
  { key: "nav.pestControl", path: "/pest-control" },
  { key: "nav.events", path: "/events" },
  { key: "nav.forum", path: "/forum" },
];

const UPDATES_PATH = "/highlights";

const updatesLinkClass = (active: boolean) =>
  `rounded-md border-2 border-red-600 px-3 py-1.5 text-sm font-semibold transition-colors dark:border-red-500 ${
    active
      ? "bg-red-600 text-white shadow-sm dark:bg-red-600 dark:text-white"
      : "bg-background text-red-700 hover:bg-red-50 dark:bg-background dark:text-red-400 dark:hover:bg-red-950/40"
  }`;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            AgriLearn
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:max-w-3xl">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                isActive(item.path) ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                isActive("/admin") ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              {t("nav.admin")}
            </Link>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link to={UPDATES_PATH} className={updatesLinkClass(isActive(UPDATES_PATH))}>
            {t("nav.highlights")}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <>
              <span className="max-w-[10rem] truncate text-sm font-medium text-primary md:max-w-[12rem]">
                👋 {t("nav.greeting")}, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" /> {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t("nav.logIn")}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t("nav.signUp")}</Button>
              </Link>
            </>
          )}
        </div>

        <button type="button" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden animate-fade-in">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(item.path) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            to={UPDATES_PATH}
            onClick={() => setMobileOpen(false)}
            className={`mx-1 block py-3 text-center text-sm font-semibold ${updatesLinkClass(isActive(UPDATES_PATH))}`}
          >
            {t("nav.highlights")}
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive("/admin") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Shield className="h-4 w-4" />
              {t("nav.admin")}
            </Link>
          )}
          <div className="mt-3 flex flex-wrap items-stretch gap-2 border-t border-border pt-3">
            <LanguageToggle className="shrink-0" />
            <ThemeToggle className="shrink-0" />
            {user ? (
              <div className="min-w-0 flex-1 space-y-2">
                <p className="px-4 text-sm font-medium text-primary">
                  👋 {t("nav.greeting")}, {user.name}
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <LogOut className="mr-1 h-4 w-4" /> {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 gap-2">
                <Link to="/login" className="min-w-0 flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t("nav.logIn")}
                  </Button>
                </Link>
                <Link to="/register" className="min-w-0 flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    {t("nav.signUp")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
