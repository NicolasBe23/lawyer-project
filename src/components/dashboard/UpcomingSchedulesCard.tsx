"use client";

import { useEffect, useState } from "react";
import { getAllSchedules } from "@/services/getAllSchedules";
import { Schedule } from "@/types/types";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/lib/helpers/dateHelpers";

export const UpcomingSchedulesCard = () => {
  const t = useTranslations();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSchedules().then((res) => {
      const upcomingSchedules = res.data
        .filter((schedule) => schedule?.completed === false)
        .sort(
          (a, b) =>
            new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
        )
        .slice(0, 3);
      setSchedules(upcomingSchedules);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-900 border border-white/10 shadow rounded-lg p-4">
      <h2 className="text-base font-semibold text-white mb-3">
        {t("dashboard.nextSchedules")}
      </h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.loadingSchedules")}</p>
      ) : schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.noUpcomingSchedules")}</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {schedules.map((schedule) => (
            <li
              key={schedule.id}
              className="flex items-center justify-between p-2 rounded-md border border-white/5 bg-white/5 text-gray-200"
            >
              <span className="font-medium truncate">{schedule.title}</span>
              <span className="text-muted-foreground ml-2 shrink-0">
                {formatDateTime(schedule.dateTime)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
