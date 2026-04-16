import { allArticles } from "@/data/articles";

export type UserArticle = (typeof allArticles)[number];

const STORAGE_KEY = "agrilearn-user-articles";

export function loadStoredUserArticles(): UserArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserArticle[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredUserArticles(articles: UserArticle[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    /* quota or private mode */
  }
}
