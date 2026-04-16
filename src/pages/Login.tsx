import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowRight, Loader2, Sparkles, BookOpen, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FarmAuthLayout, farmAuthInputClass } from "@/components/auth/FarmAuthLayout";
import { AuthPasswordInput } from "@/components/auth/AuthPasswordInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        toast({
          title: t("login.toastFail"),
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      toast({ title: t("login.toastWelcomeTitle"), description: t("login.toastWelcomeDesc") });
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmAuthLayout
      leftColumn={
        <>
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-100/95 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {t("login.badge")}
          </p>
          <h1
            className="max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-emerald-50 md:text-5xl lg:text-[2.75rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("login.heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-100/75">{t("login.heroDesc")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-100/90 backdrop-blur-md">
              <BookOpen className="h-4 w-4 shrink-0 text-emerald-400" />
              {t("login.chipGuides")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-100/90 backdrop-blur-md">
              <Users className="h-4 w-4 shrink-0 text-emerald-400" />
              {t("login.chipCommunity")}
            </span>
          </div>
        </>
      }
      rightColumn={
        <div className="w-full max-w-[420px]">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/45 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-10">
            <h2
              className="text-center text-2xl font-bold text-emerald-50 md:text-[1.65rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("login.signIn")}
            </h2>
            <p className="mt-2 text-center text-sm text-emerald-200/65">{t("login.enterCreds")}</p>
            <p className="mt-1.5 text-center text-xs text-emerald-200/45">{t("login.sameAsRegistered")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium text-emerald-100/90">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/70" />
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={farmAuthInputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium text-emerald-100/90">
                  {t("login.password")}
                </label>
                <AuthPasswordInput
                  id="login-password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full border-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:from-emerald-400 hover:to-emerald-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("login.signingIn")}
                  </>
                ) : (
                  <>
                    {t("login.continue")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-emerald-200/55">
              {t("login.newHere")}{" "}
              <Link
                to="/register"
                state={location.state}
                className="font-semibold text-emerald-300 underline-offset-4 transition hover:text-emerald-200 hover:underline"
              >
                {t("login.createAccount")}
              </Link>
            </p>
          </div>
        </div>
      }
    />
  );
};

export default Login;
