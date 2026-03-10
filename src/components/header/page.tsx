"use client";

import SplitText from "@/components/ui/SplitText";
import { useUser } from "@/lib/useUser";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations();
  const { user } = useUser();

  return (
    <div className="flex justify-between items-center p-2 mb-4 border-b-2 border-gray-300 pb-4 w-full">
      <div className="flex flex-col">
        <SplitText
          text={t("header.subtitle")}
          tag="p"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="left"
          className="text-2xl"
        />
      </div>
      <div className="flex flex-col">
        <SplitText
          text={t("header.helloUser", { username: user?.username ?? "" })}
          tag="p"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="left"
          className="text-xl"
        />
      </div>
    </div>
  );
}
