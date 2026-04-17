import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return { title: `${t("title")} — LawManagement` };
}

const SECTION_KEYS = [
  "acceptance",
  "description",
  "registration",
  "acceptable",
  "intellectual",
  "liability",
  "changes",
  "contact",
] as const;

export default function TermsPage() {
  const t = useTranslations("terms");
  const tFooter = useTranslations("landing.footer");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mb-12 text-sm text-gray-500">{t("lastUpdated")}</p>

        <div className="space-y-10">
          {SECTION_KEYS.map((key) => (
            <section key={key}>
              <h2 className="mb-3 text-lg font-semibold text-white">
                {t(`sections.${key}.title`)}
              </h2>
              <p className="leading-relaxed text-gray-400">
                {t(`sections.${key}.content`)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-400 transition-colors">
            LawManagement
          </Link>
          {" · "}
          <Link
            href="/privacy"
            className="hover:text-gray-400 transition-colors"
          >
            {tFooter("privacy")}
          </Link>
        </div>
      </div>
    </div>
  );
}
