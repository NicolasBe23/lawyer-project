"use client";

import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${ONE_YEAR_SECONDS}`;
    window.location.reload();
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 p-1",
        className,
      )}
    >
      <Button
        type="button"
        size="sm"
        variant={locale === "pt-BR" ? "default" : "outline"}
        className={cn(
          "h-7 px-3 text-xs cursor-pointer",
          locale === "pt-BR" && "bg-gray-900 text-white hover:bg-gray-800",
        )}
        onClick={() => setLocale("pt-BR")}
      >
        PT
      </Button>
      <Button
        type="button"
        size="sm"
        variant={locale === "en" ? "default" : "outline"}
        className={cn(
          "h-7 px-3 text-xs cursor-pointer",
          locale === "en" && "bg-gray-900 text-white hover:bg-gray-800",
        )}
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
    </div>
  );
}
