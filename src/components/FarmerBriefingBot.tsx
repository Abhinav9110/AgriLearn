import { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Calendar, Clock, CloudSun, Droplets, MapPinOff, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AppLanguage } from "@/i18n/translations";
import { fetchCurrentWeather, type CurrentWeatherPayload } from "@/lib/openMeteoWeather";
import { weatherCodeToMessageKey } from "@/lib/wmoWeatherCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BRIEFING_MIN_KEY = "agrilearn_briefing_minimized";

function localeForAppLang(lang: AppLanguage): string {
  if (lang === "hi") return "hi-IN";
  if (lang === "pa") return "pa-Guru-IN";
  return "en-IN";
}

export function FarmerBriefingBot() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const [expanded, setExpanded] = useState(() => {
    try {
      return typeof sessionStorage !== "undefined" ? sessionStorage.getItem(BRIEFING_MIN_KEY) !== "1" : true;
    } catch {
      return true;
    }
  });
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "pending" | "denied" | "unavailable">("idle");
  const [weather, setWeather] = useState<CurrentWeatherPayload | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const requestGeo = useCallback(() => {
    if (!user || typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("unavailable");
      return;
    }
    setGeoStatus("pending");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoStatus("idle");
      },
      () => {
        setGeoStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 600_000 },
    );
  }, [user]);

  useEffect(() => {
    if (!user || !coords) return;
    let cancelled = false;
    setWeatherError(null);
    setWeatherLoading(true);
    fetchCurrentWeather(coords.lat, coords.lon)
      .then((w) => {
        if (!cancelled) setWeather(w);
      })
      .catch(() => {
        if (!cancelled) {
          setWeather(null);
          setWeatherError("fetch");
        }
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, coords]);

  useEffect(() => {
    if (!user || !expanded) return;
    if (coords || geoStatus === "pending" || geoStatus === "denied" || geoStatus === "unavailable") return;
    requestGeo();
  }, [user, expanded, coords, geoStatus, requestGeo]);

  const locale = useMemo(() => localeForAppLang(language), [language]);

  const dateStr = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now),
    [now, locale],
  );

  const timeStr = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: language === "en",
      }).format(now),
    [now, locale, language],
  );

  const weatherLabel = weather ? t(weatherCodeToMessageKey(weather.weatherCode)) : "";

  const setMinimized = (min: boolean) => {
    setExpanded(!min);
    try {
      sessionStorage.setItem(BRIEFING_MIN_KEY, min ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  if (!user) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 md:bottom-6 md:right-6"
      aria-live="polite"
    >
      <div className="pointer-events-auto">
        {expanded ? (
          <Card className="relative w-[min(100vw-2rem,20rem)] overflow-hidden border-2 border-primary/35 bg-card/95 shadow-lg shadow-primary/15 ring-2 ring-primary/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 dark:border-primary/45 dark:ring-primary/20">
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 px-4 pb-2 pt-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base font-bold leading-tight">{t("briefing.title")}</CardTitle>
                  <p className="text-xs text-muted-foreground">{t("briefing.subtitle")}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setMinimized(true)}
                aria-label={t("briefing.minimize")}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-secondary/40 px-3 py-2.5">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("briefing.labelDate")}
                  </p>
                  <p className="text-sm font-medium leading-snug text-foreground">{dateStr}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-secondary/40 px-3 py-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("briefing.labelTime")}
                  </p>
                  <p className="font-mono text-lg font-semibold tabular-nums text-foreground" suppressHydrationWarning>
                    {timeStr}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent px-3 py-2.5">
                <div className="mb-2 flex items-center gap-2">
                  <CloudSun className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("briefing.labelWeather")}
                  </p>
                </div>
                {(geoStatus === "pending" && !coords) || (weatherLoading && !weather) ? (
                  <p className="text-sm text-muted-foreground">{t("briefing.weatherLoading")}</p>
                ) : null}
                {geoStatus === "denied" && !coords ? (
                  <div className="space-y-2">
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <MapPinOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("briefing.locationDenied")}</span>
                    </div>
                    <Button type="button" variant="secondary" size="sm" className="w-full" onClick={requestGeo}>
                      {t("briefing.retryLocation")}
                    </Button>
                  </div>
                ) : null}
                {geoStatus === "unavailable" && !coords ? (
                  <p className="text-sm text-muted-foreground">{t("briefing.geoUnavailable")}</p>
                ) : null}
                {weatherError && coords ? (
                  <p className="text-sm text-muted-foreground">{t("briefing.weatherError")}</p>
                ) : null}
                {weather ? (
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium leading-snug text-foreground">{weatherLabel}</p>
                    <p className="text-2xl font-bold tabular-nums text-foreground">
                      {Math.round(weather.temperatureC)}°C
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {t("briefing.feelsLike", { temp: Math.round(weather.apparentTemperatureC) })}
                      </span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Droplets className="h-3.5 w-3.5" aria-hidden />
                      {t("briefing.humidity", { pct: Math.round(weather.humidityPct) })}
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            type="button"
            size="lg"
            className={cn(
              "pointer-events-auto h-14 w-14 rounded-full border-2 border-primary/40 bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-colors hover:bg-primary/90 dark:border-primary/50 dark:ring-primary/25",
              "animate-in zoom-in-95 duration-300",
            )}
            onClick={() => setMinimized(false)}
            aria-expanded={false}
            aria-label={t("briefing.open")}
          >
            <Bot className="h-7 w-7" />
          </Button>
        )}
      </div>
    </div>
  );
}
