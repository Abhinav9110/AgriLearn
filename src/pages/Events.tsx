import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, ExternalLink, Check, Search, Sparkles, X, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { seedEvents } from "@/data/seedEvents";
import { isCommunityEventId, listApprovedForCatalog } from "@/lib/eventSubmissions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EventRegistrationDialog,
  type EventRegistrationItem,
} from "@/components/events/EventRegistrationDialog";

const EVENT_REGS_KEY = "agrilearn_event_regs";
const GUEST_EVENT_EMAIL_KEY = "agrilearn_events_identity_email";

const typeColors: Record<string, string> = {
  Workshop: "bg-primary/10 text-primary",
  Webinar: "bg-blue-500/10 text-blue-600",
  Meetup: "bg-accent/10 text-accent",
  Camp: "bg-orange-500/10 text-orange-600",
  Training: "bg-emerald-500/10 text-emerald-600",
  Conference: "bg-purple-500/10 text-purple-600",
};

const LOCATION_QUICK_FILTERS: { label: string; value: string }[] = [
  { label: "Online", value: "online" },
  { label: "Punjab", value: "punjab" },
  { label: "Karnataka", value: "karnataka" },
  { label: "Kerala", value: "kerala" },
  { label: "Maharashtra", value: "maharashtra" },
  { label: "Delhi", value: "delhi" },
  { label: "Telangana", value: "telangana" },
  { label: "West Bengal", value: "bengal" },
];

function loadRegisteredIds(email: string): Set<number> {
  try {
    const raw = localStorage.getItem(EVENT_REGS_KEY);
    if (!raw) return new Set();
    const all = JSON.parse(raw) as Record<string, number[]>;
    const list = all[email] ?? [];
    return new Set(list);
  } catch {
    return new Set();
  }
}

function persistRegisteredIds(email: string, ids: Set<number>) {
  try {
    const raw = localStorage.getItem(EVENT_REGS_KEY);
    const all = (raw ? JSON.parse(raw) : {}) as Record<string, number[]>;
    all[email] = [...ids];
    localStorage.setItem(EVENT_REGS_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

function readGuestIdentityEmail(): string {
  try {
    return localStorage.getItem(GUEST_EVENT_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [guestEmailKey, setGuestEmailKey] = useState(readGuestIdentityEmail);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRegistrationItem | null>(null);
  const [thanksEvent, setThanksEvent] = useState<EventRegistrationItem | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [catalogRev, setCatalogRev] = useState(0);

  const listEmail = user?.email?.trim() ?? guestEmailKey.trim();

  const allEvents = useMemo(() => {
    const approved = listApprovedForCatalog();
    return [...seedEvents, ...approved];
  }, [catalogRev]);

  useEffect(() => {
    const bump = () => setCatalogRev((v) => v + 1);
    window.addEventListener("agrilearn-events-changed", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("agrilearn-events-changed", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return allEvents;
    return allEvents.filter((e) => {
      const blob = `${e.location} ${e.title} ${e.desc}`.toLowerCase();
      return blob.includes(q);
    });
  }, [locationQuery, allEvents]);

  const [registeredIds, setRegisteredIds] = useState<Set<number>>(() => (listEmail ? loadRegisteredIds(listEmail) : new Set()));

  useEffect(() => {
    const key = user?.email?.trim() ?? guestEmailKey.trim();
    if (key) setRegisteredIds(loadRegisteredIds(key));
    else setRegisteredIds(new Set());
  }, [user?.email, guestEmailKey]);

  const openRegisterDialog = (e: EventRegistrationItem) => {
    setSelectedEvent(e);
    setDialogOpen(true);
  };

  const handleConfirmRegistration = async (payload: { name: string; email: string; phone: string }) => {
    if (!selectedEvent) return;
    const email = (user?.email ?? payload.email).trim();

    if (!payload.name.trim() || !email) {
      toast({ title: t("events.missingDetails"), description: t("events.missingDetailsDesc"), variant: "destructive" });
      return;
    }

    const existing = loadRegisteredIds(email);
    if (existing.has(selectedEvent.id)) {
      toast({ title: t("events.alreadyReg"), description: t("events.alreadyRegDesc", { title: selectedEvent.title }) });
      setDialogOpen(false);
      setSelectedEvent(null);
      return;
    }

    const next = new Set(existing);
    next.add(selectedEvent.id);
    persistRegisteredIds(email, next);
    setRegisteredIds(next);

    if (!user?.email) {
      try {
        localStorage.setItem(GUEST_EVENT_EMAIL_KEY, email);
      } catch {
        /* ignore */
      }
      setGuestEmailKey(email);
    }

    const ev = selectedEvent;
    setDialogOpen(false);
    setSelectedEvent(null);
    setThanksEvent(ev);
    setCatalogRev((v) => v + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {t("events.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("events.subtitle")}</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {user ? (
              <Button asChild className="gap-2 rounded-xl">
                <Link to="/events/submit">
                  <CalendarPlus className="h-4 w-4" />
                  {t("events.proposeBtn")}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild className="gap-2 rounded-xl">
                <Link to="/login" state={{ from: { pathname: "/events/submit" } }}>
                  {t("events.loginToPropose")}
                </Link>
              </Button>
            )}
            <p className="text-xs text-muted-foreground sm:max-w-md">{t("events.proposeHint")}</p>
          </div>

          <section
            className="mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-accent/[0.06] p-6 shadow-lg shadow-primary/10 md:p-8"
            aria-label="Search and filter events by location"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 ring-2 ring-primary/20">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden />
                  </span>
                  <span className="leading-snug">{t("events.findNear")}</span>
                </h2>
                <p className="max-w-lg pl-0 text-sm text-muted-foreground md:pl-14">{t("events.findHint")}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-border/80 bg-background/90 px-4 py-3 shadow-sm backdrop-blur-sm lg:mt-1">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div className="text-right leading-tight">
                  <p className="text-2xl font-bold tabular-nums text-foreground">{filteredEvents.length}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t("events.ofTotal", { n: allEvents.length })}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-6 max-w-2xl">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-primary/70"
                aria-hidden
              />
              <Input
                type="search"
                value={locationQuery}
                onChange={(ev) => setLocationQuery(ev.target.value)}
                placeholder={t("events.searchPh")}
                className="h-14 rounded-2xl border-primary/25 bg-background/95 pl-12 pr-12 text-base shadow-inner transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15"
                aria-label="Search events by location"
              />
              {locationQuery ? (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setLocationQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="mt-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("events.popular")}
              </p>
              <div className="flex flex-wrap gap-2">
                {LOCATION_QUICK_FILTERS.map((chip) => {
                  const q = locationQuery.trim().toLowerCase();
                  const active = q === chip.value.toLowerCase();
                  return (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => setLocationQuery(active ? "" : chip.value)}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "border-border/90 bg-background/90 text-foreground hover:border-primary/40 hover:bg-accent/80 hover:shadow-sm",
                      )}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-primary/25 bg-gradient-to-b from-muted/40 to-muted/20 py-16 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Search className="h-7 w-7 text-primary/80" aria-hidden />
              </div>
              <p className="font-medium text-foreground">{t("events.emptyTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("events.emptyDesc")}</p>
              <Button type="button" variant="default" className="mt-5" onClick={() => setLocationQuery("")}>
                {t("events.showAll")}
              </Button>
            </div>
          ) : null}
          {filteredEvents.map((e) => {
            const isRegistered = registeredIds.has(e.id);
            return (
              <div
                key={e.id}
                className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[e.type] || "bg-secondary text-foreground"}`}>
                      {e.type}
                    </span>
                    {isCommunityEventId(e.id) ? (
                      <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide">
                        {t("events.communityBadge")}
                      </Badge>
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {e.seats - e.registered} {t("events.seatsLeft")}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{e.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{e.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" /> {e.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" /> {e.time}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {e.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" /> {t("events.speakers")} {e.speakers.join(", ")}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(e.registered / e.seats) * 100}%` }} />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={isRegistered ? "secondary" : "default"}
                    disabled={isRegistered}
                    onClick={() => openRegisterDialog(e)}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="mr-1 h-3 w-3" /> {t("events.registered")}
                      </>
                    ) : (
                      <>
                        {t("events.register")} <ExternalLink className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <Dialog open={thanksEvent !== null} onOpenChange={(open) => !open && setThanksEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-xl">{t("events.thanksTitle")}</DialogTitle>
            <DialogDescription className="space-y-3 pt-2 text-base text-foreground/90">
              <span className="block">
                {t("events.thanksMeet")}{" "}
                <strong className="text-foreground">{thanksEvent?.date}</strong>
                {thanksEvent?.time ? (
                  <>
                    {" "}
                    (<span className="whitespace-nowrap">{thanksEvent.time}</span>)
                  </>
                ) : null}
                .
              </span>
              <span className="block text-sm text-muted-foreground">{t("events.thanksSeeYou")}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button type="button" className="w-full sm:w-auto" onClick={() => setThanksEvent(null)}>
              {t("events.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EventRegistrationDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        defaultName={user?.name ?? ""}
        defaultEmail={user?.email ?? guestEmailKey}
        emailLocked={!!user?.email}
        onConfirm={handleConfirmRegistration}
      />

      <Footer />
    </div>
  );
};

export default Events;
