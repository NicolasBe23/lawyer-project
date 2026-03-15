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
    <div className="flex justify-center pt-2">
      <Button variant="outline" onClick={onShowMore}>
        {t("common.showMore")}
      </Button>
    </div>
  );
};
