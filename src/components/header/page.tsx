"use client";

import { useUser } from "@/lib/useUser";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations();
  const { user } = useUser();

  return (
    <div className="flex justify-between items-center p-2 mb-4 border-b-2 border-gray-300 pb-4 w-full">
      <div className="flex flex-col">
        <p className="text-2xl">{t("header.subtitle")}</p>
      </div>
      <div className="flex flex-col">
        <p>{t("header.helloUser", { username: user?.username ?? "" })}</p>
      </div>
    </div>
  );
}
