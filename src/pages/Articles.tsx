import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, User, Tag, PlusCircle, Send, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allArticles as defaultArticles } from "@/data/articles";
import { loadStoredUserArticles, saveStoredUserArticles } from "@/lib/userArticlesStorage";
import { useAuth, canUserPostArticles } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = ["All", "Composting", "Crop Management", "Pest Control", "Soil Health", "Certification"] as const;

const MAX_COVER_BYTES = 4 * 1024 * 1024;

const Articles = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [showForm, setShowForm] = useState(false);
  const [userArticles, setUserArticles] = useState<typeof defaultArticles>(() => loadStoredUserArticles());
  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newCategory, setNewCategory] = useState("Composting");
  const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const canPost = canUserPostArticles(user);
  const { t } = useLanguage();
  const { toast } = useToast();

  const allArticles = [...userArticles, ...defaultArticles];

  const filtered = allArticles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || a.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const catLabel = (c: string) => t(`cat.${c}`);

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: t("articles.imageInvalid"), variant: "destructive" });
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      toast({ title: t("articles.imageTooLarge"), variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCoverDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitArticle = () => {
    if (!newTitle.trim() || !newExcerpt.trim()) return;
    const img = coverDataUrl ?? defaultArticles[0].img;
    const newArticle = {
      id: Date.now(),
      img,
      title: newTitle,
      category: newCategory,
      author: user?.name || "Anonymous",
      time: "1 min",
      excerpt: newExcerpt,
      content: newExcerpt,
    };
    setUserArticles((prev) => {
      const next = [newArticle, ...prev];
      saveStoredUserArticles(next);
      return next;
    });
    setNewTitle("");
    setNewExcerpt("");
    setCoverDataUrl(null);
    setShowForm(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setCoverDataUrl(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("articles.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">{t("articles.subtitle")}</p>
          </div>
          {!user ? (
            <Link to="/login">
              <Button variant="outline">{t("articles.loginToWrite")}</Button>
            </Link>
          ) : canPost ? (
            <Button onClick={() => setShowForm(!showForm)}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t("articles.writeArticle")}
            </Button>
          ) : (
            <div className="max-w-sm text-right text-sm text-muted-foreground md:max-w-md">
              <span className="font-medium text-foreground">{t("articles.postingLocked")}</span> {t("articles.postingLockedDesc")}
            </div>
          )}
        </div>

        {showForm && user && canPost && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in">
            <h3 className="mb-4 font-semibold text-foreground">{t("articles.submitNew")}</h3>
            <p className="mb-3 text-xs text-muted-foreground">{t("articles.submitNote")}</p>
            <Input placeholder={t("articles.titlePh")} className="mb-3" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div className="mb-3">
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {catLabel(c)}
                    </option>
                  ))}
              </select>
            </div>
            <Textarea
              placeholder={t("articles.contentPh")}
              className="mb-4"
              rows={6}
              value={newExcerpt}
              onChange={(e) => setNewExcerpt(e.target.value)}
            />

            <div className="mb-4 space-y-2">
              <Label htmlFor="article-cover">{t("articles.coverLabel")}</Label>
              <p className="text-xs text-muted-foreground">{t("articles.coverHint")}</p>
              <input
                ref={coverInputRef}
                id="article-cover"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleCoverFile}
              />
              <div className="flex flex-wrap items-start gap-3">
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => coverInputRef.current?.click()}>
                  <ImagePlus className="h-4 w-4" />
                  {t("articles.chooseImage")}
                </Button>
                {coverDataUrl ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCoverDataUrl(null)}>
                    {t("articles.removeImage")}
                  </Button>
                ) : null}
              </div>
              {coverDataUrl ? (
                <div className="mt-2 overflow-hidden rounded-lg border border-border bg-muted/30">
                  <img src={coverDataUrl} alt="" className="max-h-48 w-full object-cover" />
                </div>
              ) : (
                <div className="mt-2 flex aspect-video max-w-md items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center text-xs text-muted-foreground">
                  {t("articles.coverEmpty")}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitArticle}>
                <Send className="mr-2 h-4 w-4" /> {t("articles.submitReview")}
              </Button>
              <Button variant="outline" onClick={closeForm}>
                {t("articles.cancel")}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("articles.searchPh")} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge
                key={c}
                variant={activeCategory === c ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(c)}
              >
                {catLabel(c)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Link to={`/articles/${a.id}`} key={a.id}>
              <article className="group h-full overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {catLabel(a.category)}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {a.time}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{a.title}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" /> {a.author}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">{t("articles.noResults")}</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Articles;
