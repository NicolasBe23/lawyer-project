"use client";

import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Banner() {
  const t = useTranslations("landing.banner");

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-white/5 rounded-2xl shadow-md p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-6 h-6 text-blue-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">{t("title")}</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
        </div>
      </div>
    </section>
  );
}
