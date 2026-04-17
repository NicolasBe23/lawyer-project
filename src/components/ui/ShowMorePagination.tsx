"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type ShowMorePaginationProps = {
  hasMore: boolean;
  onShowMore: () => void;
};

export const ShowMorePagination = ({
  hasMore,
  onShowMore,
}: ShowMorePaginationProps) => {
  const t = useTranslations();

  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center pt-2 ">
      <Button
        className="bg-gray-900 border border-white/10 shadow text-amber-50 hover:bg-gray-700 cursor-pointer"
        onClick={onShowMore}
      >
        {t("common.showMore")}
      </Button>
    </div>
  );
};
