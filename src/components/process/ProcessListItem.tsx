"use client";

import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ProcessStatusBadge } from "@/components/process/ProcessStatusBadge";
import { AnimatedListItem } from "@/components/ui/AnimatedListItem";
import { formatDate } from "@/lib/helpers/dateHelpers";
import { Process } from "@/types/types";

type ProcessListItemProps = {
  process: Process;
  index: number;
  onViewDetails: () => void;
};

export const ProcessListItem = ({
  process,
  index,
  onViewDetails,
}: ProcessListItemProps) => {
  const t = useTranslations();

  return (
    <AnimatedListItem
      index={index}
      delay={0.03}
      duration={0.1125}
      amount={0.3}
      initialScale={0.72}
    >
      <div className="flex flex-col gap-4 rounded-lg border p-4 transition-colors md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h4 className="font-semibold text-lg">{process.title}</h4>
            <ProcessStatusBadge status={process.processStatus} />
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              {t("processes.process")}: {process.processNumber}
            </p>
            <p>
              {t("clients.name")}: {process.client?.name || t("common.na")}
            </p>
            <p>
              {t("processes.start")}: {formatDate(process.startDate)}
            </p>
            {process.completionDate && (
              <p>
                {t("processes.completed")}: {formatDate(process.completionDate)}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer md:ml-4 md:w-auto"
          onClick={onViewDetails}
        >
          <Eye className="w-4 h-4 mr-2" />
          {t("processes.viewDetails")}
        </Button>
      </div>
    </AnimatedListItem>
  );
};
