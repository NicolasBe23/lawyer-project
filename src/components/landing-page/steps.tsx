"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LANDING_STEPS } from "@/components/constants/page";
import { useTranslations } from "next-intl";

export default function Steps() {
  const t = useTranslations("landing.steps");

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            {t("sectionDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {LANDING_STEPS.map((step, index) => (
            <div key={step.key} className="relative">
              <Card className="bg-gray-900 border-white/5 shadow-md text-center items-center py-8 gap-4">
                <CardContent className="px-6 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(`${step.key}.description`)}
                  </p>
                </CardContent>
              </Card>

              {index < LANDING_STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-blue-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8"
          >
            <Link href="/register">
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
