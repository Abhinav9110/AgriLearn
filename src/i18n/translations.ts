export type AppLanguage = "en" | "hi" | "pa";

export const LANG_STORAGE_KEY = "agrilearn-lang";

export function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    if (v === "hi" || v === "pa" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return "en";
}

