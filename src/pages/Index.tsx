import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Search,
  Sprout,
  Shield,
  Lightbulb,
  Calendar,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MessageKey } from "@/i18n/messages";
import heroFarm from "@/assets/hero-farm.jpg";
import composting from "@/assets/composting.jpg";
import cropRotation from "@/assets/crop-rotation.jpg";
import pestControlImg from "@/assets/pest-control.jpg";
import soilManagement from "@/assets/soil-management.jpg";

const FEATURE_DEFS: {
  icon: typeof BookOpen;
  titleKey: MessageKey;
  descKey: MessageKey;
  link: string;
}[] = [
  { icon: BookOpen, titleKey: "home.feature.knowledge.title", descKey: "home.feature.knowledge.desc", link: "/articles" },
  { icon: Sprout, titleKey: "home.feature.crop.title", descKey: "home.feature.crop.desc", link: "/crop-guide" },
  { icon: Shield, titleKey: "home.feature.pest.title", descKey: "home.feature.pest.desc", link: "/pest-control" },
  { icon: Users, titleKey: "home.feature.community.title", descKey: "home.feature.community.desc", link: "/forum" },
  { icon: Search, titleKey: "home.feature.search.title", descKey: "home.feature.search.desc", link: "/articles" },
  { icon: Lightbulb, titleKey: "home.feature.expert.title", descKey: "home.feature.expert.desc", link: "/events" },
  { icon: Calendar, titleKey: "home.feature.events.title", descKey: "home.feature.events.desc", link: "/events" },
];

const ARTICLE_DEFS: {
  img: string;
  titleKey: MessageKey;
  categoryKey: MessageKey;
  timeKey: MessageKey;
  id: number;
}[] = [
  { img: composting, titleKey: "home.article1.title", categoryKey: "home.article1.cat", timeKey: "home.article1.time", id: 1 },
  { img: cropRotation, titleKey: "home.article2.title", categoryKey: "home.article2.cat", timeKey: "home.article2.time", id: 2 },
  { img: pestControlImg, titleKey: "home.article3.title", categoryKey: "home.article3.cat", timeKey: "home.article3.time", id: 3 },
  { img: soilManagement, titleKey: "home.article4.title", categoryKey: "home.article4.cat", timeKey: "home.article4.time", id: 4 },
  { img: composting, titleKey: "home.article5.title", categoryKey: "home.article5.cat", timeKey: "home.article5.time", id: 5 },
  { img: cropRotation, titleKey: "home.article6.title", categoryKey: "home.article6.cat", timeKey: "home.article6.time", id: 6 },
];

const STATS: { value: string; labelKey: MessageKey }[] = [
  { value: "500+", labelKey: "home.stat.articles" },
  { value: "10K+", labelKey: "home.stat.farmers" },
  { value: "200+", labelKey: "home.stat.experts" },
  { value: "50+", labelKey: "home.stat.guides" },
];

const TOP_CROPS: { name: MessageKey; badge: MessageKey; why: MessageKey; how: MessageKey }[] = [
  { name: "home.pick1.name", badge: "home.pick1.badge", why: "home.pick1.why", how: "home.pick1.how" },
  { name: "home.pick2.name", badge: "home.pick2.badge", why: "home.pick2.why", how: "home.pick2.how" },
  { name: "home.pick3.name", badge: "home.pick3.badge", why: "home.pick3.why", how: "home.pick3.how" },
];

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroFarm} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-36">
          <div className="max-w-2xl animate-fade-up">
            <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              {t("home.badge")}
            </span>
            <h1
              className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("home.title")}
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">{t("home.subtitle")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link to="/articles" className="inline-flex sm:shrink-0">
                <Button
                  size="lg"
                  className="h-14 min-w-[200px] rounded-xl bg-gradient-primary px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:brightness-105 hover:shadow-xl hover:shadow-primary/30 md:text-lg"
                >
                  {t("home.exploreArticles")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link to="/register" className="inline-flex sm:shrink-0">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group h-auto min-h-14 min-w-[220px] justify-start whitespace-normal rounded-xl border-2 border-primary-foreground/50 bg-primary-foreground/10 py-3 pl-4 pr-6 text-left text-base font-semibold text-primary-foreground shadow-md backdrop-blur-md transition-all hover:border-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground hover:shadow-lg md:min-w-[260px] md:text-lg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20 transition-colors group-hover:bg-primary-foreground/25">
                      <UserPlus className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="ml-3 text-left leading-tight">
                      {t("home.joinCommunity")}
                      <span className="mt-0.5 block text-xs font-normal text-primary-foreground/75 md:text-sm">
                        {t("home.joinSub")}
                      </span>
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card py-10">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.labelKey} className="text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              {t("home.featuresTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("home.featuresSubtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURE_DEFS.map((f) => (
              <Link
                to={f.link}
                key={f.titleKey}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {t(f.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(f.descKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-gradient-to-b from-muted/30 via-background to-secondary/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                {t("home.picks.kicker")}
              </div>
              <h2
                className="mb-3 text-3xl font-bold text-foreground md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("home.picks.title")}
              </h2>
              <p className="text-muted-foreground md:text-lg">{t("home.picks.subtitle")}</p>
            </div>
            <Link
              to="/crop-guide"
              className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline md:text-base"
            >
              {t("home.picks.viewGuide")}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {TOP_CROPS.map((crop) => (
              <div
                key={crop.name}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-card-hover"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Sprout className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="max-w-[11rem] text-right text-[11px] font-medium leading-snug text-muted-foreground md:text-xs">
                    {t(crop.badge)}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {t(crop.name)}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{t(crop.why)}</p>
                <div className="mt-auto rounded-xl bg-secondary/60 p-4 ring-1 ring-border/80">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{t("home.picks.howLabel")}</p>
                  <p className="text-sm leading-relaxed text-foreground/90">{t(crop.how)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {t("home.latestTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("home.latestSubtitle")}</p>
            </div>
            <Link to="/articles" className="hidden text-sm font-medium text-primary hover:underline md:block">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLE_DEFS.map((a) => (
              <Link
                to={`/articles/${a.id}`}
                key={a.titleKey}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={a.img}
                    alt=""
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                      {t(a.categoryKey)}
                    </span>
                    <span className="text-xs text-muted-foreground">{t(a.timeKey)}</span>
                  </div>
                  <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">{t(a.titleKey)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-primary p-10 text-center md:p-16">
              <h2
                className="text-3xl font-bold text-primary-foreground md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("home.ctaTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">{t("home.ctaSubtitle")}</p>
              <Link to="/register">
                <Button size="lg" className="mt-8 bg-card text-lg text-primary hover:bg-card/90">
                  {t("home.ctaButton")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
