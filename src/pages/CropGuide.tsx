import { useMemo, useState } from "react";
import {
  Sprout,
  Droplets,
  Sun,
  Calendar,
  ThermometerSun,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  LayoutGrid,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MessageKey } from "@/i18n/messages";
import cropRotation from "@/assets/crop-rotation.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  planOrganicCrops,
  type SeasonChoice,
  type SoilChoice,
} from "@/data/organicCropMatch";
import { acresToHectares, detailsToGuideSteps } from "@/lib/cropGuideSteps";

const crops = [
  {
    name: "Tomato", season: "Kharif (Jun-Oct)", soil: "Loamy, well-drained", water: "Moderate", temp: "20-30°C",
    tips: "Use neem cake as organic fertilizer. Support with stakes. Mulch to retain moisture.",
    details: "Tomatoes are one of the most popular crops for organic farming. They require full sunlight (6-8 hours daily) and consistent watering. Start seeds indoors 6-8 weeks before the last frost date. Transplant when seedlings are 6-8 inches tall.\n\n**Organic Practices:**\n- Apply compost or well-rotted FYM at 20-25 tons/hectare before transplanting\n- Use neem cake at 250 kg/hectare as base fertilizer\n- Mulch with straw to conserve moisture and suppress weeds\n- Stake or cage plants to improve air circulation and reduce disease\n\n**Common Diseases:** Early blight, late blight, fusarium wilt\n**Organic Control:** Bordeaux mixture, Trichoderma application, crop rotation with non-solanaceous crops\n\n**Expected Yield:** 25-30 tons/hectare with good organic management"
  },
  {
    name: "Wheat", season: "Rabi (Nov-Apr)", soil: "Clay loam", water: "Low-Moderate", temp: "15-25°C",
    tips: "Apply vermicompost before sowing. Practice crop rotation with legumes for nitrogen fixing.",
    details: "Wheat is India's second most important cereal crop. Organic wheat farming focuses on soil health and natural nutrient management.\n\n**Sowing:** November-December, seed rate 100 kg/hectare\n**Spacing:** Row-to-row 20-22.5 cm\n\n**Organic Nutrient Management:**\n- FYM at 10-12 tons/hectare, applied 3-4 weeks before sowing\n- Vermicompost at 2-3 tons/hectare\n- Bio-fertilizers: Azotobacter + PSB seed treatment\n- Foliar spray of panchagavya at tillering stage\n\n**Weed Management:** Manual weeding at 25-30 DAS, use of mulch between rows\n\n**Irrigation:** 4-5 irrigations at crown root, tillering, jointing, flowering, and grain-filling stages\n\n**Expected Yield:** 35-40 quintals/hectare"
  },
  {
    name: "Rice (Paddy)", season: "Kharif (Jun-Nov)", soil: "Clay, waterlogged", water: "High", temp: "25-35°C",
    tips: "Use azolla as bio-fertilizer. Practice SRI method for better yields with less water.",
    details: "Rice is the staple food crop of India. The System of Rice Intensification (SRI) method has revolutionized organic rice farming.\n\n**SRI Method Benefits:**\n- 40-50% less water usage\n- 80-90% less seed requirement\n- 20-30% higher yields\n\n**Organic Practices:**\n- Grow azolla in paddy fields — fixes 25-30 kg N/hectare/season\n- Apply FYM at 12-15 tons/hectare\n- Use BGA (Blue Green Algae) for nitrogen fixation\n- Neem cake application for pest control and nutrition\n\n**Nursery Management:** Raise seedlings in organic nursery beds with compost-enriched soil. Transplant 12-14 day old seedlings (SRI) or 21-25 day (conventional).\n\n**Expected Yield:** 50-60 quintals/hectare with SRI method"
  },
  {
    name: "Potato", season: "Rabi (Oct-Mar)", soil: "Sandy loam", water: "Moderate", temp: "15-20°C",
    tips: "Hill up soil around plants. Use wood ash for potassium. Rotate with cereals.",
    details: "Potatoes are a high-value cash crop that responds well to organic management when soil health is maintained.\n\n**Seed Treatment:** Treat seed tubers with Trichoderma viride solution before planting\n**Spacing:** 60 cm between rows, 20 cm between plants\n\n**Organic Nutrient Management:**\n- FYM at 25-30 tons/hectare\n- Vermicompost at 5 tons/hectare\n- Wood ash at 2-3 tons/hectare (excellent potassium source)\n- Bone meal for phosphorus\n\n**Earthing Up:** Do at 30 and 45 days after planting to promote tuber formation\n\n**Disease Management:**\n- Late blight: Bordeaux mixture spray, resistant varieties like Kufri Jyoti\n- Early blight: Trichoderma spray, proper spacing for air circulation\n\n**Expected Yield:** 20-25 tons/hectare"
  },
  {
    name: "Maize", season: "Kharif (Jun-Sep)", soil: "Well-drained loam", water: "Moderate", temp: "21-30°C",
    tips: "Intercrop with legumes. Apply FYM at sowing. Avoid waterlogging.",
    details: "Maize is a versatile crop used for food, fodder, and industrial purposes. It responds excellently to organic intercropping systems.\n\n**Seed Rate:** 20-25 kg/hectare\n**Spacing:** 60-75 cm x 20-25 cm\n\n**Intercropping Benefits:**\n- Maize + Cowpea: Nitrogen fixation, weed suppression\n- Maize + Soybean: Higher total productivity per unit area\n- Maize + Pumpkin: Ground cover reduces weeds\n\n**Organic Nutrient Management:**\n- FYM at 10-12 tons/hectare\n- Vermicompost at 2.5 tons/hectare\n- Azotobacter seed treatment\n- Foliar spray of jeevamrut at 25 and 45 DAS\n\n**Pest Management:**\n- Fall armyworm: Trichogramma egg parasitoid release, neem oil spray\n- Stem borer: Light traps, pheromone traps\n\n**Expected Yield:** 40-50 quintals/hectare"
  },
  {
    name: "Mustard", season: "Rabi (Oct-Feb)", soil: "Loamy", water: "Low", temp: "10-25°C",
    tips: "Good for crop rotation. Seeds can be used for bio-pesticide preparation.",
    details: "Mustard is an important oilseed crop and natural pest repellent. It's excellent as a companion crop and in rotation systems.\n\n**Varieties:** Pusa Bold, Varuna, RH-30 (suitable for organic farming)\n**Seed Rate:** 4-5 kg/hectare\n**Spacing:** 30-45 cm x 10-15 cm\n\n**Organic Management:**\n- FYM at 8-10 tons/hectare\n- Sulphur application through gypsum at 200 kg/hectare\n- Bio-fertilizers: Azotobacter + PSB\n\n**Pest Management:**\n- Aphid: Neem oil spray, yellow sticky traps, release of ladybird beetles\n- Painted bug: Clean cultivation, removal of crop residues\n\n**Dual Purpose:** Mustard oil cake is an excellent organic fertilizer and pest repellent for other crops\n\n**Expected Yield:** 12-15 quintals/hectare"
  },
  {
    name: "Turmeric", season: "Kharif (May-Jan)", soil: "Rich loamy, well-drained", water: "Moderate-High", temp: "20-30°C",
    tips: "Needs partial shade. Excellent intercrop with coconut or mango orchards.",
    details: "Turmeric is a high-value spice crop with excellent export potential in organic form.\n\n**Seed Rate:** 2,500 kg rhizomes/hectare\n**Spacing:** 30 x 20 cm\n\n**Organic Practices:**\n- FYM at 30-40 tons/hectare\n- Neem cake at 2 tons/hectare\n- Mulching with green leaves at 12-15 tons/hectare (applied at planting and 45 DAS)\n\n**Intercropping:** Plant between rows of young orchards for additional income\n\n**Processing:** Boil rhizomes for 45-60 minutes, dry in sun for 10-15 days, polish by rubbing\n\n**Organic Premium:** Organic turmeric fetches 30-40% higher prices in export markets\n\n**Expected Yield:** 20-25 tons fresh rhizomes/hectare"
  },
  {
    name: "Sugarcane", season: "Feb-Mar (Spring) / Oct (Autumn)", soil: "Deep loam, well-drained", water: "High", temp: "20-35°C",
    tips: "Apply press mud and filter cake. Use trash mulching for weed control.",
    details: "Organic sugarcane farming is gaining popularity with increasing demand for organic jaggery and sugar.\n\n**Seed Rate:** 40,000-45,000 three-budded setts/hectare\n**Spacing:** 90-120 cm between rows\n\n**Organic Nutrient Management:**\n- FYM at 25 tons/hectare\n- Press mud at 10 tons/hectare\n- Green manuring with dhaincha before planting\n- Bio-fertilizers: Azotobacter + PSB + Acetobacter\n\n**Trash Mulching:** Leave dried leaves between rows to suppress weeds and conserve moisture\n\n**Ratoon Management:** Apply extra compost after harvest for ratoon crop\n\n**Value Addition:** Process into organic jaggery for 2-3x premium over raw sugarcane\n\n**Expected Yield:** 80-100 tons/hectare (plant crop)"
  },
  {
    name: "Chickpea (Gram)",
    season: "Rabi (Oct–Mar)",
    soil: "Well-drained loam to sandy loam",
    water: "Low",
    temp: "15–28°C",
    tips: "Inoculate seed with Rhizobium. Avoid waterlogging — root rot is common in heavy clay.",
    details: "Chickpea is a key protein crop and fixes nitrogen for the following season. Organic systems rely on **crop rotation** and bio-inputs rather than DAP-heavy schedules.\n\n**Seed & sowing:**\n- Seed rate ~60–75 kg/hectare (adjust by variety and seed size)\n- Spacing ~30–45 cm × 10–15 cm depending on variety\n- Treat seed with **Rhizobium + PSB** as per supplier rates\n\n**Organic nutrition:**\n- FYM 8–12 tons/hectare at field prep\n- Single super phosphate from allowed organic sources where soil P is low (soil test first)\n- Avoid fresh manure close to sowing — salt and ammonia risk\n\n**Water:** One pre-sowing irrigation if soil is dry; 1–2 irrigations at flowering/pod fill in dry regions only\n\n**Major pests/diseases:** Pod borer, wilt, collar rot\n**Organic responses:** Neem-based sprays, pheromone traps where justified, Trichoderma for soil-borne fungi, deep summer ploughing + rotation to break wilt\n\n**Expected yield:** 18–25 quintals/hectare under good rainfed/low-input organic management"
  },
  {
    name: "Onion",
    season: "Rabi / late Kharif (region-specific)",
    soil: "Sandy loam, high organic matter",
    water: "Moderate (even moisture critical)",
    temp: "15–25°C (bulbing)",
    tips: "Direct seed or transplant from nursery. Stop high nitrogen late — soft necks and poor storage.",
    details: "Onions need **steady moisture** without waterlogging and a full season plan for **storage diseases**.\n\n**Nursery (transplanted):**\n- Raise on compost-rich beds; harden seedlings before transplant\n- Transplant at 6–8 true-leaf stage where local practice allows\n\n**Direct seeding:**\n- Precision spacing and light irrigation critical for uniform stands\n\n**Organic nutrition:**\n- FYM/compost at basal; avoid excess fresh manure — thick neck and rot\n- Sulphur availability matters for pungency — organic gypsum where soils are sulphur-deficient (test)\n\n**Irrigation:** Light, frequent schedules in sandy soils; reduce toward maturity for curing\n\n**Pests/diseases:** Thrips, purple blotch, basal rot\n**Organic toolkit:** Neem/soapy water for thrips (timing matters), copper-based sprays only where permitted and labeled for organic, crop rotation away from alliums\n\n**Harvest & curing:** Stop irrigation before harvest; cure in shade with good airflow\n\n**Expected yield:** 200–300 quintals/hectare (highly variable by type: red vs white, region)"
  },
  {
    name: "Brinjal (Eggplant)",
    season: "Year-round in warm tracts (peak Kharif–Rabi)",
    soil: "Loamy, rich in humus",
    water: "Moderate–high (avoid wet foliage overnight)",
    temp: "22–30°C",
    tips: "Stake large-fruited types. Remove old infected leaves to improve spray coverage.",
    details: "Brinjal is a long-duration vegetable — **integrated organic protection** for fruit and shoot borer (FSB) is essential.\n\n**Transplant:**\n- 4–5 week nursery in trays or beds with vermicompost mix\n- Spacing ~60–75 cm × 45–60 cm for spreading types\n\n**Nutrition:**\n- Heavy feeders — split compost/FYM applications; avoid ammonia spike from fresh manure\n- Calcium and boron disorders show as fruit cracks — address pH and organic calcium sources if tests show need\n\n**FSB management (organic):**\n- **Pheromone traps** for monitoring and mass trapping in pockets\n- Timely **neem-based** or approved bio-pesticide sprays on schedule (egg window)\n- Remove and destroy infested shoots early\n\n**Soil health:** Mulch to reduce splash-borne bacterial wilt risk; rotate with non-solanaceous crops\n\n**Expected yield:** 250–400 quintals/hectare depending on variety and season length"
  },
  {
    name: "Okra (Bhindi)",
    season: "Kharif–summer (warm season)",
    soil: "Sandy loam to clay loam, well-drained",
    water: "Moderate",
    temp: "25–35°C",
    tips: "Soak seed in water overnight for uniform germination. Harvest every 1–2 days in peak season.",
    details: "Okra grows fast and fruits repeatedly — **pick often** to keep plants productive.\n\n**Sowing:**\n- 3–4 kg seed/hectare (dibbling or line sowing)\n- Thin to strong plants if direct-sown stand is thick\n\n**Organic nutrition:**\n- FYM/compost at sowing; light side-dress of compost after first harvest flush if leaves pale (don’t overdo N — lush plants attract more pests)\n\n**Major pests:** Fruit borer, jassids, mites\n**Organic responses:** Neem schedules, **Trichogramma** where recommended for borers, tolerant varieties, avoid broad-spectrum even “organic” oils during peak pollinator flight if cucurbits are nearby\n\n**Water:** Drip or furrow to keep foliage drier; overhead irrigation increases leaf spot pressure\n\n**Expected yield:** 100–150 quintals/hectare over multiple pickings"
  },
  {
    name: "Green Gram (Moong)",
    season: "Summer / Kharif (short duration)",
    soil: "Sandy loam; avoid waterlogging",
    water: "Low–moderate",
    temp: "25–35°C",
    tips: "Short crop — fit between rice/wheat windows. Rhizobium inoculation boosts nodulation.",
    details: "Moong is ideal for **organic rotations** — quick biomass, nitrogen left for the next crop, and straw for mulch or fodder.\n\n**Sowing:**\n- Seed rate ~15–20 kg/hectare as pure crop (adjust for mixture/intercrop)\n- Depth shallow; moisture line critical for even emergence\n\n**Nutrition:**\n- Low external need if nodulation is good — still provide compost if soil organic carbon is very low\n- **Rhizobium** inoculation on moist seed\n\n**Water:** Often rainfed; one irrigation at flowering if terminal stress hits\n\n**Diseases:** Yellow mosaic, Cercospora leaf spot\n**Organic approach:** Resistant varieties, seed from healthy plots, destroy weed hosts at field edge, avoid late excess nitrogen\n\n**Harvest:** Pick at right moisture for grain or as vegetable (whole pod) depending on market\n\n**Expected yield:** 8–12 quintals/hectare grain (variable); green pod harvests differ by market system"
  },
  {
    name: "Garlic",
    season: "Rabi (cool season bulbing)",
    soil: "Sandy loam, excellent drainage",
    water: "Moderate (reduce before harvest)",
    temp: "12–24°C (bulbing phase ideal)",
    tips: "Plant cloves upright. Long photoperiod types need matching latitude/varieties for your area.",
    details: "Garlic is **high-value** but needs clean seed cloves and **rotation** away from recent allium fields.\n\n**Planting material:**\n- Select bold, disease-free cloves; treat with **Trichoderma** slurry where wilt history exists\n\n**Spacing & depth:**\n- ~10–15 cm between plants, 15–20 cm rows (varies by bulb size target)\n\n**Nutrition:**\n- Compost/FYM at bed formation; top-dress cautiously — excess N delays maturity and hurts storage\n- Sulphur and potassium status influence bulb quality — use soil tests\n\n**Irrigation:** Steady until 2–3 weeks before harvest, then **dry down** for uniform maturity\n\n**Pests/diseases:** Thrips, purple blotch, basal rot\n**Organic:** Neem schedules for thrips, rotation, avoid waterlogging, destroy crop debris after harvest\n\n**Curing:** Shade dry with ventilation before grading — critical for market price\n\n**Expected yield:** 50–100 quintals/hectare (very variety- and climate-dependent)"
  },
];

const SEASON_OPTIONS: SeasonChoice[] = ["kharif", "rabi", "summer", "year_round"];
const SOIL_OPTIONS: SoilChoice[] = [
  "loamy",
  "clay_loam",
  "sandy_loam",
  "sandy",
  "waterlogged",
  "rich_loam",
];

function RichDetailText({ details }: { details: string }) {
  return (
    <div className="prose max-w-none">
      {details.split("\n\n").map((block, i) => {
        if (block.startsWith("**") && block.endsWith("**")) {
          return (
            <h5 key={i} className="mt-4 mb-2 font-bold text-foreground">
              {block.replace(/\*\*/g, "")}
            </h5>
          );
        }
        const parts = block.split("\n").map((line, j) => {
          if (line.startsWith("- ")) {
            return (
              <li key={j} className="ml-4 list-disc text-sm text-muted-foreground">
                {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
              </li>
            );
          }
          return (
            <p key={j} className="mb-1 text-sm text-muted-foreground">
              {line.replace(/\*\*(.*?)\*\*/g, "$1")}
            </p>
          );
        });
        return (
          <div key={i} className="mb-3">
            {parts}
          </div>
        );
      })}
    </div>
  );
}

function localizeStepTitle(
  title: string,
  t: (key: MessageKey, vars?: Record<string, string | number>) => string,
): string {
  if (title === "Overview") return t("cropGuide.stepOverview");
  const part = /^Part (\d+)$/.exec(title);
  if (part) return t("cropGuide.stepPart", { n: part[1] });
  return title;
}

const CropGuide = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState("browse");
  const [plannerSeason, setPlannerSeason] = useState<SeasonChoice>("kharif");
  const [plannerSoil, setPlannerSoil] = useState<SoilChoice>("loamy");
  const [landSize, setLandSize] = useState("1");
  const [landUnit, setLandUnit] = useState<"ha" | "acre">("ha");
  const [plannerSubmitted, setPlannerSubmitted] = useState(false);
  const [selectedPlannerCrop, setSelectedPlannerCrop] = useState<string | null>(null);

  const { t } = useLanguage();

  const areaHa = useMemo(() => {
    const n = parseFloat(landSize.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return 0;
    return landUnit === "acre" ? acresToHectares(n) : n;
  }, [landSize, landUnit]);

  const plannerResult = useMemo(() => {
    if (!plannerSubmitted) return { exact: [] as typeof crops, partial: [] as typeof crops };
    return planOrganicCrops(crops, plannerSeason, plannerSoil);
  }, [plannerSubmitted, plannerSeason, plannerSoil]);

  const selectedCropData = useMemo(
    () => crops.find((c) => c.name === selectedPlannerCrop) ?? null,
    [selectedPlannerCrop],
  );

  const guideSteps = useMemo(
    () => (selectedCropData ? detailsToGuideSteps(selectedCropData.details) : []),
    [selectedCropData],
  );

  const handlePlannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlannerSubmitted(true);
    const { exact, partial } = planOrganicCrops(crops, plannerSeason, plannerSoil);
    const first = exact[0] ?? partial[0];
    setSelectedPlannerCrop(first ? first.name : null);
  };

  const handlePlannerReset = () => {
    setPlannerSubmitted(false);
    setSelectedPlannerCrop(null);
    setLandSize("1");
    setLandUnit("ha");
  };

  const rawLand = parseFloat(landSize.replace(",", "."));
  const landOk = Number.isFinite(rawLand) && rawLand > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative">
        <img src={cropRotation} alt="" className="h-48 w-full object-cover md:h-64" width={800} height={600} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-6">
          <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {t("cropGuide.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("cropGuide.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="mb-8 grid w-full max-w-lg grid-cols-2">
            <TabsTrigger value="browse" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              {t("cropGuide.tabBrowse")}
            </TabsTrigger>
            <TabsTrigger value="planner" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              {t("cropGuide.tabPlanner")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {crops.map((crop) => (
                <div
                  key={crop.name}
                  className={`rounded-xl border bg-card p-6 shadow-card transition-all ${
                    expanded === crop.name
                      ? "border-primary md:col-span-2 lg:col-span-3"
                      : "cursor-pointer border-border hover:-translate-y-1 hover:shadow-card-hover"
                  }`}
                  onClick={() => expanded !== crop.name && setExpanded(crop.name)}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Sprout className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{crop.name}</h3>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {crop.season}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(expanded === crop.name ? null : crop.name);
                      }}
                      className="rounded-lg p-2 transition-colors hover:bg-secondary"
                    >
                      {expanded === crop.name ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sun className="h-4 w-4 text-accent" />{" "}
                      <span className="font-medium text-foreground">{t("cropGuide.soil")}</span> {crop.soil}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Droplets className="h-4 w-4 text-primary" />{" "}
                      <span className="font-medium text-foreground">{t("cropGuide.water")}</span> {crop.water}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ThermometerSun className="h-4 w-4 text-destructive" />{" "}
                      <span className="font-medium text-foreground">{t("cropGuide.temp")}</span> {crop.temp}
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                    <p className="mb-1 text-xs font-medium text-foreground">{t("cropGuide.tips")}</p>
                    <p className="text-xs text-muted-foreground">{crop.tips}</p>
                  </div>

                  {expanded === crop.name && (
                    <div className="mt-6 animate-fade-in border-t border-border pt-6">
                      <h4
                        className="mb-4 text-lg font-bold text-foreground"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {t("cropGuide.detailed", { name: crop.name })}
                      </h4>
                      <RichDetailText details={crop.details} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planner" className="mt-0 space-y-8">
            <div className="mx-auto max-w-2xl space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {t("cropGuide.plannerTitle")}
              </h2>
              <p className="text-muted-foreground">{t("cropGuide.plannerSubtitle")}</p>
            </div>

            <Card className="mx-auto max-w-2xl border-border shadow-card">
              <CardHeader>
                <CardTitle>{t("cropGuide.fieldSummary")}</CardTitle>
                <CardDescription>{t("cropGuide.scalingHint")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlannerSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="season">{t("cropGuide.fieldSeason")}</Label>
                      <Select
                        value={plannerSeason}
                        onValueChange={(v) => setPlannerSeason(v as SeasonChoice)}
                      >
                        <SelectTrigger id="season">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SEASON_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(`cropGuide.season.${s}` as MessageKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="soil">{t("cropGuide.fieldSoil")}</Label>
                      <Select value={plannerSoil} onValueChange={(v) => setPlannerSoil(v as SoilChoice)}>
                        <SelectTrigger id="soil">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SOIL_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(`cropGuide.soil.${s}` as MessageKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="land">{t("cropGuide.fieldLandSize")}</Label>
                      <Input
                        id="land"
                        type="text"
                        inputMode="decimal"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                        placeholder="e.g. 2.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">{t("cropGuide.fieldLandUnit")}</Label>
                      <Select value={landUnit} onValueChange={(v) => setLandUnit(v as "ha" | "acre")}>
                        <SelectTrigger id="unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ha">{t("cropGuide.unitHa")}</SelectItem>
                          <SelectItem value="acre">{t("cropGuide.unitAcre")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit">{t("cropGuide.submitPlanner")}</Button>
                    <Button type="button" variant="outline" onClick={handlePlannerReset}>
                      {t("cropGuide.resetPlanner")}
                    </Button>
                  </div>
                </form>

                {plannerSubmitted && landOk && (
                  <p className="mt-6 text-sm text-muted-foreground">
                    {t("cropGuide.areaInHa", {
                      ha: areaHa.toFixed(2),
                      raw: landSize,
                      unit: landUnit === "ha" ? t("cropGuide.unitHa") : t("cropGuide.unitAcre"),
                    })}
                  </p>
                )}
              </CardContent>
            </Card>

            {plannerSubmitted && (
              <div className="space-y-6">
                {plannerResult.exact.length === 0 && plannerResult.partial.length === 0 && (
                  <Card className="border-destructive/40 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-destructive">{t("cropGuide.noMatches")}</CardTitle>
                      <CardDescription>{t("cropGuide.adjustFilters")}</CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {plannerResult.exact.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Sprout className="h-5 w-5 text-primary" />
                      {t("cropGuide.recommended")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {plannerResult.exact.map((c) => (
                        <Button
                          key={c.name}
                          type="button"
                          variant={selectedPlannerCrop === c.name ? "default" : "secondary"}
                          size="sm"
                          className="h-auto min-h-10 whitespace-normal py-2 text-left"
                          onClick={() => setSelectedPlannerCrop(c.name)}
                        >
                          {c.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {plannerResult.partial.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{t("cropGuide.alsoConsider")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {plannerResult.partial.map((c) => (
                        <Button
                          key={c.name}
                          type="button"
                          variant={selectedPlannerCrop === c.name ? "default" : "outline"}
                          size="sm"
                          className="h-auto min-h-10 whitespace-normal py-2 text-left"
                          onClick={() => setSelectedPlannerCrop(c.name)}
                        >
                          {c.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCropData && (
                  <Card className="border-primary/30 shadow-card">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-xl">{selectedCropData.name}</CardTitle>
                        <Badge variant="secondary">{selectedCropData.season}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-3 text-sm sm:grid-cols-3">
                        <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                          <Sun className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <div>
                            <span className="font-medium text-foreground">{t("cropGuide.soil")}</span>
                            <p className="text-muted-foreground">{selectedCropData.soil}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                          <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <span className="font-medium text-foreground">{t("cropGuide.water")}</span>
                            <p className="text-muted-foreground">{selectedCropData.water}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                          <ThermometerSun className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                          <div>
                            <span className="font-medium text-foreground">{t("cropGuide.temp")}</span>
                            <p className="text-muted-foreground">{selectedCropData.temp}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="mb-1 text-xs font-medium text-foreground">{t("cropGuide.tips")}</p>
                        <p className="text-sm text-muted-foreground">{selectedCropData.tips}</p>
                      </div>

                      <div>
                        <h4
                          className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          <ClipboardList className="h-5 w-5 text-primary" />
                          {t("cropGuide.stepsHeading")}
                        </h4>
                        <ol className="space-y-6">
                          {guideSteps.map((step, idx) => (
                            <li key={`${step.title}-${idx}`}>
                              <div className="flex gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0 flex-1 space-y-2">
                                  <p className="font-semibold text-foreground">
                                    {localizeStepTitle(step.title, t)}
                                  </p>
                                  {step.body ? <RichDetailText details={step.body} /> : null}
                                </div>
                              </div>
                              {idx < guideSteps.length - 1 && <Separator className="mt-6" />}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default CropGuide;
