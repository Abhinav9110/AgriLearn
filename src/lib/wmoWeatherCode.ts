import type { MessageKey } from "@/i18n/messages";

/** WMO weather interpretation codes (Open-Meteo). Maps to `briefing.weather.*` keys */
export function weatherCodeToMessageKey(code: number): MessageKey {
  if (code === 0) return "briefing.weather.clear";
  if (code >= 1 && code <= 3) return "briefing.weather.cloudy";
  if (code === 45 || code === 48) return "briefing.weather.fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "briefing.weather.drizzle";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "briefing.weather.rain";
  if ([66, 67].includes(code)) return "briefing.weather.freezing_rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "briefing.weather.snow";
  if ([95, 96, 99].includes(code)) return "briefing.weather.storm";
  return "briefing.weather.other";
}
