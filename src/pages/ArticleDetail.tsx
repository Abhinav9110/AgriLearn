import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allArticles } from "@/data/articles";
import { loadStoredUserArticles } from "@/lib/userArticlesStorage";
import { useLanguage } from "@/contexts/LanguageContext";

/** Renders `**bold**` segments inside article body copy */
function renderWithBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

const ArticleDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const stored = loadStoredUserArticles();
  const article =
    stored.find((a) => a.id === Number(id)) ?? allArticles.find((a) => a.id === Number(id));

  const catLabel = (c: string) => t(`cat.${c}`);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground">{t("articleDetail.notFound")}</h1>
          <p className="mt-2 text-muted-foreground">{t("articleDetail.notFoundDesc")}</p>
          <Link to="/articles">
            <Button className="mt-6">{t("articleDetail.back")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const merged = [...stored, ...allArticles];
  const related = merged.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="container mx-auto px-4 py-10">
        <Link to="/articles" className="mb-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("articleDetail.back")}
        </Link>

        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              <Tag className="mr-1 h-3 w-3" />
              {catLabel(article.category)}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {article.time} {t("articleDetail.readSuffix")}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              {article.author}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
            {article.title}
          </h1>

          <div className="mb-8 aspect-video overflow-hidden rounded-xl">
            <img src={article.img} alt={article.title} className="h-full w-full object-cover" />
          </div>

          <div className="prose prose-green max-w-none text-foreground">
            {article.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="mb-4 mt-8 text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    {renderWithBold(block.replace("## ", ""))}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={i} className="mb-3 mt-6 text-xl font-semibold text-foreground">
                    {renderWithBold(block.replace("### ", ""))}
                  </h3>
                );
              }
              if (block.includes("\n- ")) {
                const lines = block.split("\n");
                const title = lines[0].startsWith("- ") ? null : lines[0];
                const items = lines.filter((l) => l.startsWith("- "));
                return (
                  <div key={i} className="mb-4">
                    {title && <p className="mb-2 text-foreground/90">{renderWithBold(title)}</p>}
                    <ul className="list-disc space-y-1 pl-6">
                      {items.map((item, j) => (
                        <li key={j} className="text-muted-foreground">
                          {renderWithBold(item.replace("- ", ""))}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              if (block.includes("\n1. ") || /^\d+\.\s/.test(block.split("\n")[0] ?? "")) {
                const lines = block.split("\n");
                const title = /^\d+\./.test(lines[0] ?? "") ? null : lines[0];
                const items = lines.filter((l) => /^\d+\./.test(l));
                return (
                  <div key={i} className="mb-4">
                    {title && <p className="mb-2 text-foreground/90">{renderWithBold(title)}</p>}
                    <ol className="list-decimal space-y-1 pl-6">
                      {items.map((item, j) => (
                        <li key={j} className="text-muted-foreground">
                          {renderWithBold(item.replace(/^\d+\.\s*/, ""))}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              }
              return (
                <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
                  {renderWithBold(block)}
                </p>
              );
            })}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("articleDetail.related")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((a) => (
                <Link
                  to={`/articles/${a.id}`}
                  key={a.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={a.img}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {catLabel(a.category)}
                    </Badge>
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">{a.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
