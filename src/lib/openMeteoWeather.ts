/** Open-Meteo forecast — free, no API key. https://open-meteo.com/ */

export type CurrentWeatherPayload = {
  temperatureC: number;
  apparentTemperatureC: number;
  humidityPct: number;
  weatherCode: number;
  timeIso: string;
};

type OpenMeteoCurrentResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
};

export async function fetchCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeatherPayload> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code",
    timezone: "auto",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error(`weather_http_${res.status}`);
  const json = (await res.json()) as OpenMeteoCurrentResponse;
  const c = json.current;
  if (!c) throw new Error("weather_no_current");
  return {
    temperatureC: c.temperature_2m,
    apparentTemperatureC: c.apparent_temperature,
    humidityPct: c.relative_humidity_2m,
    weatherCode: c.weather_code,
    timeIso: c.time,
  };
}
