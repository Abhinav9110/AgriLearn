import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AppLanguage } from "@/i18n/translations";

const OPTIONS: { value: AppLanguage; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिंदी" },
  { value: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const current = OPTIONS.find((o) => o.value === language) ?? OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative h-9 w-9 shrink-0 gap-0", className)}
          aria-label="Change language"
          title="Language"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Language: {current.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[11rem]">
        {OPTIONS.map((o) => (
          <DropdownMenuItem
            key={o.value}
            onClick={() => setLanguage(o.value)}
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <span>
              <span className="font-medium">{o.native}</span>
              <span className="ml-2 text-xs text-muted-foreground">({o.label})</span>
            </span>
            {language === o.value ? <span className="text-xs text-primary">✓</span> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
