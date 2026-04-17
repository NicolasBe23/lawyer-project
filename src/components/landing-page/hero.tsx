"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t("badge")}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
          {t("title")}{" "}
          <span className="text-blue-400">{t("titleHighlight")}</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8">
            <Link href="/register">
              {t("ctaPrimary")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white rounded-xl px-8"
          >
            <Link href="/login">{t("ctaSecondary")}</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-gray-500">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
