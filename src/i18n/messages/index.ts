import type { AppLanguage } from "@/i18n/translations";
import { en } from "./en";
import { hi } from "./hi";
import { pa } from "./pa";

export type { MessageKey } from "./en";

const catalogs: Record<AppLanguage, Record<string, string>> = {
  en,
  hi,
  pa,
};

export function translate(
  lang: AppLanguage,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const table = catalogs[lang] ?? catalogs.en;
  let s = table[key] ?? catalogs.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{{${k}}}`, String(v));
    }
  }
  return s;
}
