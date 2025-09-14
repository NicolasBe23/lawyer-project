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
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    {
      value: "active",
      label: "Active",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      value: "archived",
      label: "Archived",
      icon: Archive,
      color: "text-gray-600",
    },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsLoading(true);
    try {
      const result = await updateProcessStatus(
        processId,
        newStatus as "active" | "completed" | "archived"
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Process status updated to ${newStatus}`);
        onStatusChange(newStatus);
      }
    } catch {
      toast.error("Failed to update process status");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus
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
          Change Status
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
                Current
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
