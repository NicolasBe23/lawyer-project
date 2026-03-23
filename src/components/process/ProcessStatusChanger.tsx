"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CheckCircle, Archive } from "lucide-react";
import { updateProcessStatus } from "@/services/updateProcess";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ProcessStatusChangerProps {
  processId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export const ProcessStatusChanger = ({
  processId,
  currentStatus,
  onStatusChange,
}: ProcessStatusChangerProps) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    {
      value: "active",
      label: t("dashboard.active"),
      icon: CheckCircle,
      color: "status-icon-active",
    },
    {
      value: "completed",
      label: t("dashboard.completed"),
      icon: CheckCircle,
      color: "status-icon-completed",
    },
    {
      value: "archived",
      label: t("dashboard.archived"),
      icon: Archive,
      color: "status-icon-archived",
    },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsLoading(true);
    try {
      const optionLabel =
        statusOptions.find((option) => option.value === newStatus)?.label ||
        newStatus;
      const result = await updateProcessStatus(
        processId,
        newStatus as "active" | "completed" | "archived",
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          t("processes.processStatusUpdatedTo", { status: optionLabel }),
        );
        onStatusChange(newStatus);
      }
    } catch {
      toast.error(t("processes.failedToUpdateProcessStatus"));
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus,
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {currentStatusOption && (
            <currentStatusOption.icon
              className={`w-4 h-4 ${currentStatusOption.color}`}
            />
          )}
          {t("processes.changeStatus")}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className="flex items-center gap-2 cursor-pointer"
            disabled={option.value === currentStatus}
          >
            <option.icon className={`w-4 h-4 ${option.color}`} />
            <span>{option.label}</span>
            {option.value === currentStatus && (
              <span className="ml-auto text-xs text-muted-foreground">
                {t("processes.current")}
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
