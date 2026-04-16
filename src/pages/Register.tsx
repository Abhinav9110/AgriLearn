import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, User, ArrowRight, Loader2, Sparkles, Sprout, Calendar, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type SignupAccountType } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FarmAuthLayout, farmAuthInputClass } from "@/components/auth/FarmAuthLayout";
import { AuthPasswordInput } from "@/components/auth/AuthPasswordInput";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<SignupAccountType>("farmer");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signup(name, email, password, accountType);
      if (!result.success) {
        toast({
          title: t("register.toastFailTitle"),
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: t("register.toastOkTitle"),
        description: accountType === "admin" ? t("register.toastOkAdmin") : t("register.toastOkFarmer"),
      });
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel =
    strength === 0
      ? ""
      : strength === 1
        ? t("register.strengthWeak")
        : strength === 2
          ? t("register.strengthGood")
          : t("register.strengthStrong");

  return (
    <FarmAuthLayout
      leftColumn={
        <>
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-100/95 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {t("register.badge")}
          </p>
          <h1
            className="max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-emerald-50 md:text-5xl lg:text-[2.75rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("register.heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-100/75">{t("register.heroDesc")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-100/90 backdrop-blur-md">
              <Sprout className="h-4 w-4 shrink-0 text-emerald-400" />
              {t("register.chipOrganic")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-100/90 backdrop-blur-md">
              <Calendar className="h-4 w-4 shrink-0 text-emerald-400" />
              {t("register.chipEvents")}
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
              {t("register.title")}
            </h2>
            <p className="mt-2 text-center text-sm text-emerald-200/65">{t("register.subtitle")}</p>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/50 px-3 py-2.5 text-xs leading-snug text-emerald-200/80">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-300/90" />
              {t("register.passwordHint")}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <span className="text-sm font-medium text-emerald-100/90">{t("register.signingUpAs")}</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("farmer")}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all ${
                      accountType === "farmer"
                        ? "border-emerald-400/70 bg-emerald-500/15 ring-2 ring-emerald-400/50"
                        : "border-emerald-500/25 bg-emerald-950/30 hover:border-emerald-500/40"
                    }`}
                  >
                    <Sprout className="h-5 w-5 text-emerald-300" />
                    <span className="text-xs font-semibold text-emerald-50">{t("register.roleFarmer")}</span>
                    <span className="text-[10px] leading-tight text-emerald-200/70">{t("register.roleFarmerSub")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("admin")}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all ${
                      accountType === "admin"
                        ? "border-emerald-400/70 bg-emerald-500/15 ring-2 ring-emerald-400/50"
                        : "border-emerald-500/25 bg-emerald-950/30 hover:border-emerald-500/40"
                    }`}
                  >
                    <Shield className="h-5 w-5 text-emerald-300" />
                    <span className="text-xs font-semibold text-emerald-50">{t("register.roleAdmin")}</span>
                    <span className="text-[10px] leading-tight text-emerald-200/70">{t("register.roleAdminSub")}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-name" className="text-sm font-medium text-emerald-100/90">
                  {t("register.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/70" />
                  <Input
                    id="reg-name"
                    autoComplete="name"
                    placeholder="Your name"
                    className={farmAuthInputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="reg-email" className="text-sm font-medium text-emerald-100/90">
                  {t("register.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/70" />
                  <Input
                    id="reg-email"
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
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="reg-password" className="text-sm font-medium text-emerald-100/90">
                    {t("register.password")}
                  </label>
                  {password.length > 0 && (
                    <span
                      className={
                        strength < 2
                          ? "text-amber-300/90"
                          : strength === 2
                            ? "text-emerald-300/90"
                            : "text-emerald-200"
                      }
                    >
                      {strengthLabel}
                    </span>
                  )}
                </div>
                <AuthPasswordInput
                  id="reg-password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                {password.length > 0 && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-emerald-950/80 ring-1 ring-emerald-500/20">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 1 ? "w-1/3 bg-amber-500" : strength === 2 ? "w-2/3 bg-emerald-400" : "w-full bg-emerald-300"
                      }`}
                    />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full border-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:from-emerald-400 hover:to-emerald-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("register.creating")}
                  </>
                ) : (
                  <>
                    {t("register.submit")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-emerald-200/55">
              {t("register.hasAccount")}{" "}
              <Link
                to="/login"
                state={location.state}
                className="font-semibold text-emerald-300 underline-offset-4 transition hover:text-emerald-200 hover:underline"
              >
                {t("register.signInLink")}
              </Link>
            </p>
          </div>
        </div>
      }
    />
  );
};

export default Register;
