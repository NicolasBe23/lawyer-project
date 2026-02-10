"use client";

import { useEffect, useState } from "react";
import { Process } from "@/types/types";
import { getAllProcesses } from "@/services/getAllProcesses";
import { useTranslations } from "next-intl";

export const RecentProcessesCard = () => {
  const t = useTranslations();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  const getProcessStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t("dashboard.inProgress");
      case "completed":
        return t("dashboard.completed");
      case "archived":
        return t("dashboard.archived");
      default:
        return t("dashboard.pending");
    }
  };

  useEffect(() => {
    getAllProcesses().then((res) => {
      const sortedProcesses = res.data
        .filter((process) => process && process.title)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);
      setProcesses(sortedProcesses);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.lastProcesses")}
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500">
          {t("dashboard.loadingProcesses")}
        </p>
      ) : processes.length === 0 ? (
        <p className="text-sm text-gray-500">{t("dashboard.noProcessFound")}</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {processes.map((process) => (
            <li key={process.id} className="p-2 border rounded">
              {process.title} – {getProcessStatusText(process.processStatus)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
