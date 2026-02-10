import { ProcessStatusBadgeProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const ProcessStatusBadge = ({
  status,
  size = "md",
}: ProcessStatusBadgeProps) => {
  const t = useTranslations();
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
      className={`${sizeClasses} rounded-full font-medium text-sm ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "completed"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
      }`}
    >
      {getProcessStatusText(status)}
    </span>
  );
};
