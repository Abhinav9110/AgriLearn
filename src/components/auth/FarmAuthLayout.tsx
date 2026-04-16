import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import heroFarm from "@/assets/hero-farm.jpg";

export const farmAuthInputClass =
  "h-12 border-emerald-500/25 bg-emerald-950/40 pl-10 text-emerald-50 placeholder:text-emerald-300/35 focus-visible:border-emerald-400/60 focus-visible:ring-emerald-400/25";

type FarmAuthLayoutProps = {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
};

export function FarmAuthLayout({ leftColumn, rightColumn }: FarmAuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1 md:right-5 md:top-5">
        <LanguageToggle className="border border-emerald-400/20 bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/50 hover:text-emerald-50" />
        <ThemeToggle className="border border-emerald-400/20 bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/50 hover:text-emerald-50" />
      </div>
      <div className="absolute inset-0">
        <img
          src={heroFarm}
          alt=""
          className="h-full w-full object-cover scale-105"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/97 via-[hsl(155_40%_10%/0.92)] to-[hsl(100_30%_8%/0.95)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_70%_20%,rgba(52,211,153,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(251,191,36,0.06),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col justify-center px-6 py-14 lg:px-12 lg:py-20">
          <Link
            to="/"
            className="mb-10 inline-flex w-fit items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-950/30 px-4 py-2.5 backdrop-blur-md transition-colors hover:border-emerald-400/40"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-900/50">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-50" style={{ fontFamily: "var(--font-heading)" }}>
              AgriLearn
            </span>
          </Link>
          {leftColumn}
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-16 pt-8 lg:px-10 lg:py-20">
          {rightColumn}
        </div>
      </div>
    </div>
  );
}
