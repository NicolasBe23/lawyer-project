"use client";

import SplitText from "@/components/ui/SplitText";
import { useTranslations } from "next-intl";

type HeaderProps = {
  username?: string;
};

const formatDisplayName = (fullName: string) => {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length <= 1) {
    return nameParts[0] ?? "";
  }

  return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
};

export default function Header({ username = "" }: HeaderProps) {
  const t = useTranslations();
  const displayName = formatDisplayName(username);

  return (
    <div className="flex w-full flex-col gap-2 border-b-2 border-gray-300 p-2 pb-4 items-center md:flex-row md:items-center md:justify-between">
      <SplitText
        text={t("header.helloUser", { username: displayName })}
        tag="p"
        splitType="words"
        delay={30}
        duration={0.7}
        ease="power2.out"
        textAlign="left"
        className="text-2xl sm:text-xl md:order-2"
      />
      <SplitText
        text={t("header.subtitle")}
        tag="p"
        splitType="words"
        delay={30}
        duration={0.7}
        ease="power2.out"
        textAlign="center"
        className="text-lg sm:text-2xl md:order-1"
      />
    </div>
  );
}
