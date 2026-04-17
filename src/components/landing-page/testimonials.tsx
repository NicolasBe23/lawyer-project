"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LANDING_TESTIMONIALS } from "@/components/constants/page";
import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("landing.testimonials");

  return (
    <section id="testimonials" className="py-24 px-6 bg-gray-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            {t("sectionDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LANDING_TESTIMONIALS.map((item) => (
            <Card
              key={item.id}
              className="bg-gray-900 border-white/5 shadow-md gap-0 py-0"
            >
              <CardContent className="px-6 py-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed italic flex-1">
                  &ldquo;{t(item.id)}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-xs">{item.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
