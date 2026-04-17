"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-300 transition-colors">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            {t("privacy")}
          </Link>
          <a
            href="mailto:nicolasbezerra13@gmail.com"
            className="hover:text-gray-300 transition-colors"
          >
            {t("contact")}
          </a>
        </nav>

        <p className="text-xs text-gray-600">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
