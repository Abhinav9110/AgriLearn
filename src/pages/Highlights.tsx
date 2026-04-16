import {
  type LucideIcon,
  Building2,
  Newspaper,
  ExternalLink,
  Landmark,
  MapPinned,
  Sprout,
  Globe2,
  CalendarDays,
  Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MessageKey } from "@/i18n/messages";
import soilManagement from "@/assets/soil-management.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  HIGHLIGHT_SCHEME_IDS,
  HIGHLIGHT_NEWS_IDS,
  HIGHLIGHT_SCHEME_LINKS,
  SCHEME_ACCENTS,
  NEWS_ACCENTS,
  type HighlightSchemeId,
} from "@/data/highlights";
import { cn } from "@/lib/utils";

const SCHEME_ICONS: Record<HighlightSchemeId, LucideIcon> = {
  s1: Landmark,
  s2: MapPinned,
  s3: Sprout,
  s4: Globe2,
};

const Highlights = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative">
        <img
          src={soilManagement}
          alt=""
          className="h-48 w-full object-cover md:h-64"
          width={800}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-6">
          <h1
            className="text-4xl font-bold text-foreground drop-shadow-sm md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("highlights.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">{t("highlights.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent px-4 py-4 shadow-sm backdrop-blur-sm md:px-5 md:py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-lg">
            ⚠️
          </span>
          <p className="text-sm leading-relaxed text-foreground/90 md:text-[0.9375rem]">{t("highlights.verifyNote")}</p>
        </div>

        <Tabs defaultValue="schemes" className="w-full">
          <TabsList className="mb-10 grid h-auto w-full max-w-lg grid-cols-2 gap-1 rounded-2xl border border-border bg-muted/40 p-1.5 shadow-inner">
            <TabsTrigger
              value="schemes"
              className="gap-2 rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground"
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{t("highlights.tabSchemes")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="gap-2 rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground"
            >
              <Newspaper className="h-4 w-4 shrink-0" />
              <span className="truncate">{t("highlights.tabNews")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schemes" className="mt-0 focus-visible:outline-none">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("highlights.tabSchemes")}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="grid gap-6 md:gap-7">
              {HIGHLIGHT_SCHEME_IDS.map((id) => {
                const href = HIGHLIGHT_SCHEME_LINKS[id];
                const accent = SCHEME_ACCENTS[id];
                const Icon = SCHEME_ICONS[id];
                return (
                  <Card
                    key={id}
                    className={cn(
                      "group relative overflow-hidden border-border/80 bg-card shadow-md transition-all duration-300",
                      "hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5",
                    )}
                  >
                    <div
                      className={cn("h-1.5 w-full bg-gradient-to-r opacity-95", accent.topBar)}
                      aria-hidden
                    />
                    <div
                      className={cn(
                        "pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br blur-3xl",
                        accent.gradient,
                      )}
                      aria-hidden
                    />
                    <CardContent className="relative p-0">
                      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:gap-6 md:p-7">
                        <div
                          className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
                            accent.iconWrap,
                          )}
                        >
                          <Icon className="h-7 w-7" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h2
                              className="text-lg font-bold leading-snug text-foreground md:text-xl"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {t(`highlights.scheme.${id}.title` as MessageKey)}
                            </h2>
                            <Badge
                              variant="outline"
                              className={cn("shrink-0 font-medium shadow-sm", accent.badgeClass)}
                            >
                              {t(`highlights.scheme.${id}.tag` as MessageKey)}
                            </Badge>
                          </div>
                          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
                            {t(`highlights.scheme.${id}.summary` as MessageKey)}
                          </p>
                          <Separator className="bg-border/60" />
                          {href ? (
                            <div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 rounded-lg border-dashed font-semibold transition-colors hover:border-primary/50 hover:bg-primary/5"
                                asChild
                              >
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                  {t("highlights.learnMore")}
                                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                                </a>
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-0 focus-visible:outline-none">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("highlights.tabNews")}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="relative pl-2 md:pl-4">
              <div
                className="absolute bottom-4 left-[1.15rem] top-4 w-px bg-gradient-to-b from-border via-primary/25 to-border md:left-[1.35rem]"
                aria-hidden
              />

              <div className="space-y-5 md:space-y-6">
                {HIGHLIGHT_NEWS_IDS.map((id, index) => {
                  const accent = NEWS_ACCENTS[id];
                  return (
                    <article
                      key={id}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md transition-all duration-300",
                        "hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-lg",
                        accent.glow,
                      )}
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70",
                          accent.gradient,
                        )}
                        aria-hidden
                      />
                      <div className="relative flex gap-0 md:gap-2">
                        <div className="flex w-10 shrink-0 flex-col items-center pt-5 md:w-12 md:pt-6">
                          <span
                            className={cn(
                              "z-[1] flex h-8 w-8 items-center justify-center rounded-full border-2 border-background shadow-md ring-2 ring-background",
                              accent.accentLine,
                            )}
                            aria-hidden
                          >
                            <span className="h-2.5 w-2.5 rounded-full bg-background" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 py-5 pr-4 md:py-6 md:pr-7">
                          <div className="mb-3 flex flex-wrap items-center gap-2 gap-y-2">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                                accent.dateChip,
                              )}
                            >
                              <CalendarDays className="h-3.5 w-3.5 opacity-80" />
                              {t(`highlights.news.${id}.date` as MessageKey)}
                            </span>
                            {index === 0 ? (
                              <Badge className="border-0 bg-primary/90 text-primary-foreground shadow-sm">
                                {t("highlights.newsNewBadge")}
                              </Badge>
                            ) : null}
                          </div>
                          <h2
                            className="mb-3 text-lg font-bold leading-snug text-foreground md:text-xl"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {t(`highlights.news.${id}.title` as MessageKey)}
                          </h2>
                          <div className="relative rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-3 pl-10 md:px-5 md:py-4">
                            <Quote
                              className="absolute left-2.5 top-3 h-5 w-5 text-primary/35 md:left-3 md:top-3.5"
                              aria-hidden
                            />
                            <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                              {t(`highlights.news.${id}.excerpt` as MessageKey)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Highlights;
