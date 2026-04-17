"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function FlagBR() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="#009C3B" />
      <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#FFDF00" />
      <circle cx="10" cy="7" r="3" fill="#002776" />
      <path d="M7.2 6.2 Q10 5 12.8 6.2" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="2" fill="white" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} x="0" y={y} width="20" height="1" fill="#B22234" />
      ))}
      <rect width="8" height="7" fill="#3C3B6E" />
    </svg>
  );
}

export function LandingLanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("landing.header");

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${ONE_YEAR_SECONDS}`;
    window.location.reload();
  };

  const next = locale === "pt-BR" ? "en" : "pt-BR";
  const label = locale === "pt-BR" ? "PT" : "EN";
  const Flag = locale === "pt-BR" ? FlagBR : FlagUS;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setLocale(next)}
          className={cn(
            "inline-flex items-center gap-2 h-8 px-3 rounded-lg cursor-pointer",
            "border border-white/10 bg-white/5 hover:bg-white/10",
            "text-gray-300 hover:text-white text-xs font-medium transition-colors",
          )}
        >
          <Flag />
          {label}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-gray-800 border-white/10 text-gray-200 text-xs"
      >
        {t("switchLanguage")}
      </TooltipContent>
    </Tooltip>
  );
}
