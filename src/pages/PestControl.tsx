import { useState } from "react";
import { Bug, Shield, Leaf, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Droplets } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import pestImg from "@/assets/pest-control.jpg";

const methods = [
  {
    title: "Neem-Based Solutions", icon: Leaf, effectiveness: "High",
    desc: "Neem oil and neem cake are powerful organic pesticides effective against aphids, whiteflies, and mealybugs.",
    howTo: "Mix 5ml neem oil with 1L water and a few drops of liquid soap. Spray on affected plants in the evening.",
    pests: ["Aphids", "Whiteflies", "Mealybugs", "Leaf miners"],
    details: "Neem contains azadirachtin, a compound that disrupts insect growth and feeding behavior. It acts as an antifeedant, repellent, and growth regulator.\n\n**Preparation Methods:**\n1. Neem Oil Spray: Mix 5ml neem oil + 1ml liquid soap in 1 liter warm water. Shake well before spraying.\n2. Neem Leaf Extract: Crush 1 kg fresh neem leaves, soak in 5 liters water overnight. Strain and spray.\n3. Neem Seed Kernel Extract (NSKE): Crush 500g neem seeds, soak in 10 liters water for 12 hours. Strain through cloth.\n\n**Application Schedule:**\n- Preventive: Spray every 15 days during growing season\n- Curative: Spray every 5-7 days for 3 consecutive applications\n- Best time: Early morning or late evening\n\n**Safety:** Non-toxic to humans, birds, and beneficial insects when used as directed. Avoid spraying on flowers during pollination hours."
  },
  {
    title: "Companion Planting", icon: Leaf, effectiveness: "Medium-High",
    desc: "Growing certain plants together to naturally repel pests and attract beneficial insects.",
    howTo: "Plant marigolds around vegetable beds, basil near tomatoes, and garlic near roses.",
    pests: ["Nematodes", "Tomato hornworm", "Japanese beetles"],
    details: "Companion planting is a time-tested organic strategy that uses plant relationships to control pests naturally.\n\n**Best Companion Planting Combinations:**\n- Tomato + Basil: Basil repels tomato hornworm and improves flavor\n- Cabbage + Dill: Dill attracts beneficial wasps that prey on cabbage worms\n- Corn + Beans + Squash (Three Sisters): Beans fix nitrogen, corn provides support, squash shades ground\n- Rose + Garlic: Garlic repels aphids and prevents black spot\n- Carrot + Onion: Each repels the other's primary pest\n\n**Plants That Repel Specific Pests:**\n- Mosquitoes: Citronella grass, lemongrass, lavender\n- Aphids: Chives, nasturtium, marigold\n- Whiteflies: Basil, marigold, nasturtium\n- Slugs: Rosemary, sage, lavender\n\n**Trap Cropping:** Plant sacrificial crops to lure pests away from main crops. Example: Plant blue hubbard squash to attract squash bugs away from zucchini."
  },
  {
    title: "Biological Control", icon: Bug, effectiveness: "High",
    desc: "Using natural predators like ladybugs, lacewings, and parasitic wasps to control pest populations.",
    howTo: "Release ladybugs in the evening near aphid colonies. Maintain diverse plantings to attract predators.",
    pests: ["Aphids", "Caterpillars", "Scale insects"],
    details: "Biological control harnesses nature's own pest management system by encouraging natural enemies of crop pests.\n\n**Key Bio-Control Agents:**\n1. Trichogramma: Tiny wasp that parasitizes moth eggs. Release 1-1.5 lakh eggs/hectare in 6-8 installments.\n2. Chrysoperla (Lacewing): Larvae eat 400-500 aphids each. Release at 10,000/hectare.\n3. Ladybird Beetle: Each adult eats 50-60 aphids daily. Collect and release in affected areas.\n4. Trichoderma viride: Fungus that controls soil-borne diseases. Mix with FYM and apply to soil.\n5. Pseudomonas fluorescens: Bacteria that controls wilt and root rot. Seed treatment at 10g/kg.\n\n**How to Attract Beneficial Insects:**\n- Plant flowering borders with cosmos, sunflower, and buckwheat\n- Provide water sources (shallow dishes with pebbles)\n- Avoid broad-spectrum sprays even organic ones during peak predator activity\n- Maintain hedgerows and grassy strips as habitat"
  },
  {
    title: "Garlic & Chili Spray", icon: Shield, effectiveness: "Medium",
    desc: "A homemade spray that deters a wide range of soft-bodied insects and fungal diseases.",
    howTo: "Blend 10 garlic cloves and 4 chilis with 1L water. Strain and spray on plants every 3-4 days.",
    pests: ["Caterpillars", "Aphids", "Slugs", "Fungal diseases"],
    details: "Garlic and chili sprays combine the insecticidal properties of allicin (from garlic) and capsaicin (from chili) for broad-spectrum pest control.\n\n**Recipe:**\n1. Crush 10-15 garlic cloves and 4-5 hot green chilies\n2. Soak in 1 liter of water overnight\n3. Add 1 tablespoon of liquid soap (as spreader-sticker)\n4. Strain through fine cloth\n5. Dilute: Use 100ml concentrate per liter of water for spraying\n\n**Shelf Life:** Prepare fresh every 3-4 days. Store concentrate in refrigerator for up to 1 week.\n\n**Application:**\n- Spray on both upper and lower leaf surfaces\n- Apply in evening to avoid leaf burn\n- Reapply after rain\n- Do not spray on fruits close to harvest\n\n**Caution:** Test on a few leaves first. Some sensitive plants may show leaf burn. Avoid contact with eyes."
  },
  {
    title: "Pheromone Traps", icon: Shield, effectiveness: "High",
    desc: "Species-specific traps that use synthetic insect hormones to monitor and mass-trap male moths.",
    howTo: "Install traps at crop canopy level, 5 traps per hectare. Replace lures every 3-4 weeks.",
    pests: ["Fruit borer", "Pod borer", "Stem borer", "Diamondback moth"],
    details: "Pheromone traps are highly targeted and environmentally safe tools for pest monitoring and control.\n\n**How They Work:**\nSynthetic female sex pheromones attract male moths into the trap, reducing mating success and next-generation pest populations.\n\n**Installation Guide:**\n1. Install at crop canopy height (adjust as crop grows)\n2. Place 5 traps/hectare for monitoring, 15-20/hectare for mass trapping\n3. Delta traps for monitoring, funnel traps for mass trapping\n4. Replace lures every 21-25 days\n5. Record daily catches for pest forecasting\n\n**Available Pheromone Lures in India:**\n- Helicoverpa armigera (Gram pod borer / Tomato fruit borer)\n- Spodoptera litura (Tobacco caterpillar)\n- Leucinodes orbonalis (Brinjal shoot and fruit borer)\n- Plutella xylostella (Diamond back moth)\n\n**Cost:** ₹25-40 per lure, ₹50-80 per trap. Very economical compared to pesticide applications."
  },
  {
    title: "Cow Urine & Buttermilk Sprays", icon: Droplets, effectiveness: "Medium",
    desc: "Traditional Indian preparations using cow products for pest and disease control.",
    howTo: "Ferment cow urine for 15 days. Dilute 1:10 with water and spray. Buttermilk spray for fungal issues.",
    pests: ["Fungal diseases", "Sucking pests", "Leaf spot", "Powdery mildew"],
    details: "Traditional knowledge-based preparations that are integral to Indian organic farming (especially under Zero Budget Natural Farming).\n\n**Jeevamrut (Living Nectar):**\n- 10 kg fresh cow dung + 10 liters cow urine + 2 kg jaggery + 2 kg pulse flour + handful of forest soil\n- Mix in 200 liters water, ferment for 5-7 days with daily stirring\n- Apply to soil or dilute and spray on crops\n- Boosts soil microbial activity enormously\n\n**Beejamrut (Seed Treatment):**\n- 5 kg cow dung + 5 liters cow urine + 50g lime + 20 liters water\n- Mix well and soak seeds for 20 minutes before sowing\n- Protects against seed-borne diseases\n\n**Buttermilk Spray:**\n- Mix 1 liter buttermilk with 10 liters water\n- Effective against powdery mildew and some fungal diseases\n- Spray every 7-10 days\n\n**Agniastra (Fire Weapon):**\n- 10 liters cow urine + 1 kg tobacco leaves + 500g green chili + 500g garlic + 5 kg neem leaves\n- Boil and concentrate. Dilute 2-3 liters in 100 liters water for spraying\n- Controls stem borer and bark-eating caterpillar"
  },
];

const PestControl = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative">
        <img src={pestImg} alt="" className="h-48 w-full object-cover md:h-64" width={800} height={600} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-6">
          <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {t("pest.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("pest.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-accent bg-accent/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div className="text-sm">
            <p className="font-medium text-foreground">{t("pest.reminderTitle")}</p>
            <p className="text-muted-foreground">{t("pest.reminderBody")}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {methods.map((m) => (
            <div key={m.title} className={`rounded-xl border bg-card p-6 shadow-card transition-all cursor-pointer ${expanded === m.title ? "border-primary md:col-span-2" : "border-border hover:shadow-card-hover"}`}
              onClick={() => expanded !== m.title && setExpanded(m.title)}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <m.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{m.title}</h3>
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="h-3 w-3" /> {t("pest.effectiveness")} {m.effectiveness}
                    </span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setExpanded(expanded === m.title ? null : m.title); }}
                  className="rounded-lg p-2 hover:bg-secondary transition-colors">
                  {expanded === m.title ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{m.desc}</p>
              <div className="mb-3 rounded-lg bg-secondary/50 p-3">
                <p className="text-xs font-semibold text-foreground mb-1">{t("pest.howTo")}</p>
                <p className="text-xs text-muted-foreground">{m.howTo}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {m.pests.map((p) => (
                  <span key={p} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{p}</span>
                ))}
              </div>

              {expanded === m.title && (
                <div className="mt-6 border-t border-border pt-6 animate-fade-in">
                  <h4 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    {t("pest.detailed", { name: m.title })}
                  </h4>
                  <div className="prose max-w-none">
                    {m.details.split("\n\n").map((block, i) => {
                      const parts = block.split("\n").map((line, j) => {
                        if (line.startsWith("- ")) {
                          return <li key={j} className="text-sm text-muted-foreground ml-4 list-disc">{line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>;
                        }
                        if (/^\d+\./.test(line)) {
                          return <li key={j} className="text-sm text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>;
                        }
                        return <p key={j} className="text-sm text-muted-foreground mb-1">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
                      });
                      return <div key={i} className="mb-3">{parts}</div>;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PestControl;
