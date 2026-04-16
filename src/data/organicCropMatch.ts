/** Tags for matching user inputs to crops in the organic planner */
export type SeasonChoice = "kharif" | "rabi" | "summer" | "year_round";
export type SoilChoice = "loamy" | "clay_loam" | "sandy_loam" | "sandy" | "waterlogged" | "rich_loam";

export const ORGANIC_CROP_MATCH: Record<
  string,
  { seasons: SeasonChoice[]; soils: SoilChoice[] }
> = {
  Tomato: { seasons: ["kharif"], soils: ["loamy", "sandy_loam"] },
  Wheat: { seasons: ["rabi"], soils: ["clay_loam", "loamy"] },
  "Rice (Paddy)": { seasons: ["kharif"], soils: ["waterlogged", "clay_loam"] },
  Potato: { seasons: ["rabi"], soils: ["sandy_loam", "loamy"] },
  Maize: { seasons: ["kharif", "summer"], soils: ["loamy", "sandy_loam"] },
  Mustard: { seasons: ["rabi"], soils: ["loamy", "sandy_loam"] },
  Turmeric: { seasons: ["kharif"], soils: ["rich_loam", "loamy"] },
  Sugarcane: { seasons: ["kharif", "rabi"], soils: ["loamy", "clay_loam"] },
  "Chickpea (Gram)": { seasons: ["rabi"], soils: ["sandy_loam", "loamy", "clay_loam"] },
  Onion: { seasons: ["rabi", "kharif"], soils: ["sandy_loam", "loamy"] },
  "Brinjal (Eggplant)": {
    seasons: ["year_round", "kharif", "rabi", "summer"],
    soils: ["loamy", "rich_loam"],
  },
  "Okra (Bhindi)": { seasons: ["kharif", "summer"], soils: ["sandy_loam", "loamy", "clay_loam"] },
  "Green Gram (Moong)": { seasons: ["kharif", "summer"], soils: ["sandy_loam", "sandy", "loamy"] },
  Garlic: { seasons: ["rabi"], soils: ["sandy_loam", "loamy"] },
};

export function seasonMatchesCrop(user: SeasonChoice, cropSeasons: SeasonChoice[]): boolean {
  if (user === "year_round") return cropSeasons.includes("year_round");
  return cropSeasons.includes(user) || cropSeasons.includes("year_round");
}

export function soilMatchesCrop(user: SoilChoice, cropSoils: SoilChoice[]): boolean {
  return cropSoils.includes(user);
}

export function planOrganicCrops<T extends { name: string }>(
  items: T[],
  season: SeasonChoice,
  soil: SoilChoice,
): { exact: T[]; partial: T[] } {
  const exact: T[] = [];
  const partial: T[] = [];
  for (const item of items) {
    const m = ORGANIC_CROP_MATCH[item.name];
    if (!m) continue;
    const s = seasonMatchesCrop(season, m.seasons);
    const o = soilMatchesCrop(soil, m.soils);
    if (s && o) exact.push(item);
    else if (s || o) partial.push(item);
  }
  return { exact, partial };
}
