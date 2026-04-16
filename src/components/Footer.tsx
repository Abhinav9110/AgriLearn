import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="max-w-sm">
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="h-7 w-7 shrink-0 text-primary" />
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                AgriLearn
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">{t("footer.quickLinks")}</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link to="/articles" className="text-muted-foreground transition-colors hover:text-primary">
                {t("nav.articles")}
              </Link>
              <Link to="/crop-guide" className="text-muted-foreground transition-colors hover:text-primary">
                {t("nav.cropGuide")}
              </Link>
              <Link to="/pest-control" className="text-muted-foreground transition-colors hover:text-primary">
                {t("nav.pestControl")}
              </Link>
              <Link to="/forum" className="text-muted-foreground transition-colors hover:text-primary">
                {t("nav.forum")}
              </Link>
              <Link to="/events" className="text-muted-foreground transition-colors hover:text-primary">
                {t("nav.events")}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">{t("footer.resources")}</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link to="/articles/1" className="text-muted-foreground transition-colors hover:text-primary">
                {t("footer.linkComposting")}
              </Link>
              <Link to="/articles/4" className="text-muted-foreground transition-colors hover:text-primary">
                {t("footer.linkSoil")}
              </Link>
              <Link to="/articles/6" className="text-muted-foreground transition-colors hover:text-primary">
                {t("footer.linkCert")}
              </Link>
              <Link to="/events" className="text-muted-foreground transition-colors hover:text-primary">
                {t("footer.linkEvents")}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">{t("footer.contact")}</h4>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>info@agrilearn.org</p>
              <p>
                {t("footer.addressLine1")}
                <br />
                {t("footer.addressLine2")}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
