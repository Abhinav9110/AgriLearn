/** Stable ids for i18n keys `highlights.scheme.{id}.*` and `highlights.news.{id}.*` */
export const HIGHLIGHT_SCHEME_IDS = ["s1", "s2", "s3", "s4"] as const;
export type HighlightSchemeId = (typeof HIGHLIGHT_SCHEME_IDS)[number];

export const HIGHLIGHT_NEWS_IDS = ["n1", "n2", "n3", "n4"] as const;
export type HighlightNewsId = (typeof HIGHLIGHT_NEWS_IDS)[number];

/** Visual accents for scheme cards (Tailwind class fragments) */
export const SCHEME_ACCENTS: Record<
  HighlightSchemeId,
  { gradient: string; iconWrap: string; topBar: string; badgeClass: string }
> = {
  s1: {
    gradient: "from-emerald-500/[0.12] via-transparent to-teal-500/[0.08]",
    iconWrap: "bg-emerald-500/15 text-emerald-700 ring-2 ring-emerald-500/25 dark:text-emerald-300",
    topBar: "from-emerald-500 to-teal-500",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
  },
  s2: {
    gradient: "from-sky-500/[0.12] via-transparent to-blue-500/[0.08]",
    iconWrap: "bg-sky-500/15 text-sky-800 ring-2 ring-sky-500/25 dark:text-sky-200",
    topBar: "from-sky-500 to-blue-600",
    badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-900 dark:bg-sky-500/15 dark:text-sky-100",
  },
  s3: {
    gradient: "from-amber-500/[0.12] via-transparent to-orange-500/[0.08]",
    iconWrap: "bg-amber-500/15 text-amber-900 ring-2 ring-amber-500/25 dark:text-amber-200",
    topBar: "from-amber-500 to-orange-500",
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100",
  },
  s4: {
    gradient: "from-violet-500/[0.12] via-transparent to-fuchsia-500/[0.08]",
    iconWrap: "bg-violet-500/15 text-violet-800 ring-2 ring-violet-500/25 dark:text-violet-200",
    topBar: "from-violet-500 to-fuchsia-600",
    badgeClass:
      "border-violet-500/30 bg-violet-500/10 text-violet-900 dark:bg-violet-500/15 dark:text-violet-100",
  },
};

/** Visual accents for news cards */
export const NEWS_ACCENTS: Record<
  HighlightNewsId,
  { gradient: string; dateChip: string; accentLine: string; glow: string }
> = {
  n1: {
    gradient: "from-blue-500/[0.08] to-transparent",
    dateChip: "border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-200",
    accentLine: "bg-gradient-to-b from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/10",
  },
  n2: {
    gradient: "from-rose-500/[0.08] to-transparent",
    dateChip: "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200",
    accentLine: "bg-gradient-to-b from-rose-500 to-orange-400",
    glow: "shadow-rose-500/10",
  },
  n3: {
    gradient: "from-amber-500/[0.08] to-transparent",
    dateChip: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
    accentLine: "bg-gradient-to-b from-amber-500 to-lime-500",
    glow: "shadow-amber-500/10",
  },
  n4: {
    gradient: "from-indigo-500/[0.08] to-transparent",
    dateChip: "border-indigo-500/30 bg-indigo-500/10 text-indigo-900 dark:text-indigo-100",
    accentLine: "bg-gradient-to-b from-indigo-500 to-purple-500",
    glow: "shadow-indigo-500/10",
  },
};

/** Optional official or reference links — verify before sharing in production */
export const HIGHLIGHT_SCHEME_LINKS: Partial<Record<HighlightSchemeId, string>> = {
  s1: "https://agricoop.gov.in/",
  s2: "https://agricoop.gov.in/",
  s3: "https://agricoop.gov.in/",
  s4: "https://agricoop.gov.in/",
};
