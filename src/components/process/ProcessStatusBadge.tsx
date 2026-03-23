import { ProcessStatusBadgeProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const ProcessStatusBadge = ({
  status,
  size = "md",
}: ProcessStatusBadgeProps) => {
  const t = useTranslations();
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "status-badge-active";
      case "completed":
        return "status-badge-completed";
      case "archived":
        return "status-badge-archived";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProcessStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t("dashboard.active");
      case "completed":
        return t("dashboard.completed");
      case "archived":
        return t("dashboard.archived");
      default:
        return t("dashboard.pending");
    }
  };
  const sizeClasses = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`${sizeClasses} rounded-full font-medium text-sm ${getStatusBadgeClass(status)}`}
    >
      {getProcessStatusText(status)}
    </span>
  );
};
