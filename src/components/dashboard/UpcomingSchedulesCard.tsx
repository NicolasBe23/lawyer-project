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
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.nextSchedules")}
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500">
          {t("dashboard.loadingSchedules")}
        </p>
      ) : schedules.length === 0 ? (
        <p className="text-sm text-gray-500">
          {t("dashboard.noUpcomingSchedules")}
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {schedules.map((schedule) => (
            <li key={schedule.id} className="p-2 border rounded">
              {schedule.title} – {formatDateTime(schedule.dateTime)}
              {schedule.location && ` – ${schedule.location}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
