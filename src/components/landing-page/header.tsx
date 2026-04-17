"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LandingLanguageSwitcher } from "@/components/landing-page/language-switcher";

export default function HeaderLP() {
  const t = useTranslations("landing.header");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="inline-flex items-center gap-1">
          <Image
            src="/logo_sidebar.png"
            alt="Law Management"
            width={44}
            height={44}
            priority
            className="h-11 w-auto object-contain"
          />
          <div className="flex flex-col leading-none font-bold text-amber-200 text-xs">
            <span>Law</span>
            <span>Management</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {(["features", "how-it-works", "testimonials"] as const).map(
            (id) => (
              <button
                key={id}
                onClick={() =>
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t(
                  id === "features"
                    ? "navFeatures"
                    : id === "how-it-works"
                      ? "navHowItWorks"
                      : "navTestimonials",
                )}
              </button>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LandingLanguageSwitcher />
          <Button
            variant="ghost"
            asChild
            className="text-gray-300 hover:text-white hover:bg-white/5"
          >
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
            <Link href="/register">{t("register")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
