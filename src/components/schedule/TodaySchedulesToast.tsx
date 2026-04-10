"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getAllSchedules } from "@/services/getAllSchedules";
import { isDateToday, formatTime } from "@/lib/helpers/dateHelpers";

const SESSION_KEY = "today_schedules_toast_shown";

export const TodaySchedulesToast = () => {
  const t = useTranslations("schedules");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    const notify = async () => {
      const { data, error } = await getAllSchedules();
      if (error || !data) return;

      const todaySchedules = data.filter(
        (s) => isDateToday(s.dateTime) && !s.completed
      );

      if (todaySchedules.length === 0) return;

      const sorted = [...todaySchedules].sort(
        (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );

      const first = sorted[0];
      const message =
        sorted.length === 1
          ? t("todayMeetingSingle", { time: formatTime(first.dateTime), title: first.title })
          : t("todayMeetingMultiple", { count: sorted.length, time: formatTime(first.dateTime), title: first.title });

      toast.info(`📅 ${message}`, { duration: 6000 });
    };

    notify();
  }, [t]);

  return null;
};
