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
      case "active": return t("dashboard.inProgress");
      case "completed": return t("dashboard.completed");
      case "archived": return t("dashboard.archived");
      default: return t("dashboard.pending");
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
    <div className="bg-gray-900 border border-white/10 shadow rounded-lg p-4">
      <h2 className="text-base font-semibold text-white mb-3">
        {t("dashboard.lastProcesses")}
      </h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.loadingProcesses")}</p>
      ) : processes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.noProcessFound")}</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {processes.map((process) => (
            <li
              key={process.id}
              className="flex items-center justify-between p-2 rounded-md border border-white/5 bg-white/5 text-gray-200"
            >
              <span className="font-medium truncate">{process.title}</span>
              <span className="text-muted-foreground ml-2 shrink-0">
                {getProcessStatusText(process.processStatus)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
