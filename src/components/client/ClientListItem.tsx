"use client";

import { Client } from "@/types/types";
import { useTranslations } from "next-intl";
import { AnimatedListItem } from "@/components/ui/AnimatedListItem";

type ClientListItemProps = {
  client: Client;
  index: number;
  onClick: () => void;
};

export const ClientListItem = ({
  client,
  index,
  onClick,
}: ClientListItemProps) => {
  const t = useTranslations();

  return (
    <AnimatedListItem
      index={index}
      delay={0.03}
      duration={0.1125}
      amount={0.3}
      initialScale={0.75}
    >
      <div
        className="flex cursor-pointer flex-col items-start justify-between gap-3 rounded-lg border-b border-white/10 p-3 py-5 shadow-sm transition-colors duration-200 hover:rounded-lg hover:bg-gray-800 sm:flex-row sm:items-center"
        onClick={onClick}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            <strong>{t("clients.name")}:</strong> {client.attributes.name}
          </p>
          <p className="text-sm">
            <strong>{t("clients.email")}:</strong>{" "}
            {client.attributes.email || t("common.na")}
          </p>
        </div>
        <span
          className={`self-start rounded-full px-2 py-1 text-xs sm:self-auto ${
            client.attributes.active === true
              ? "bg-green-500/15 text-green-400"
              : client.attributes.active === false
                ? "bg-blue-500/15 text-blue-400"
                : "bg-gray-700 text-gray-300"
          }`}
        >
          {client.attributes.active === true
            ? t("clients.active")
            : client.attributes.active === false
              ? t("clients.completed")
              : t("clients.archived")}
        </span>
      </div>
    </AnimatedListItem>
  );
};
