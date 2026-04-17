"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANDING_FEATURES } from "@/components/constants/page";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="py-24 px-6 bg-gray-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            {t("sectionDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LANDING_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="bg-gray-900 border-white/5 hover:border-white/15 transition-colors shadow-md gap-3 py-5"
              >
                <CardHeader className="px-5 pb-0">
                  <div
                    className={`w-10 h-10 rounded-lg ${feature.iconBg} flex items-center justify-center mb-1`}
                  >
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-white text-base">
                    {t(`${feature.id}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(`${feature.id}.description`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
