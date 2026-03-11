"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { createSchedule } from "@/services/createSchedule";
import { getAllSchedules } from "@/services/getAllSchedules";
import { deleteSchedule, markScheduleCompleted } from "@/services/updateSchedule";
import { Schedule, ScheduleFormData } from "@/types/types";

const getDateKey = (dateTime: string) => {
  const scheduleDateTime = new Date(dateTime);
  const localDate = new Date(
    scheduleDateTime.getTime() - scheduleDateTime.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().split("T")[0];
};

export const useSchedulesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isPortuguese = locale.toLowerCase().startsWith("pt");
  const calendarLocale = isPortuguese ? "pt-br" : "en";

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateSchedules, setSelectedDateSchedules] = useState<Schedule[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);

  const loadSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getAllSchedules();
      if (error) {
        toast.error(t("schedules.errorLoadingSchedulesWithMessage", { error }));
      } else {
        setSchedules(data);
      }
    } catch {
      toast.error(t("schedules.errorLoadingSchedules"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleDateClick = useCallback(
    (info: { dateStr: string }) => {
      const clickedDate = info.dateStr;

      const schedulesForDate = schedules.filter(
        (schedule) => getDateKey(schedule.dateTime) === clickedDate
      );

      setSelectedDate(clickedDate);

      if (schedulesForDate.length > 0) {
        setSelectedDateSchedules(schedulesForDate);
        setIsDetailsModalOpen(true);
      } else {
        setIsCreateModalOpen(true);
      }
    },
    [schedules]
  );

  const handleCreateSchedule = useCallback(
    async (scheduleData: ScheduleFormData) => {
      setIsCreatingSchedule(true);
      try {
        const { error } = await createSchedule(scheduleData);
        if (error) {
          toast.error(t("schedules.errorCreatingScheduleWithMessage", { error }));
        } else {
          toast.success(t("schedules.scheduleCreatedSuccessfully"));
          setIsCreateModalOpen(false);
          await loadSchedules();
        }
      } catch {
        toast.error(t("schedules.errorCreatingSchedule"));
      } finally {
        setIsCreatingSchedule(false);
      }
    },
    [loadSchedules, t]
  );

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        toast.success(t("schedules.scheduleDeletedSuccessfully"));
        await loadSchedules();
      } else {
        toast.error(result.error || t("schedules.failedToDeleteSchedule"));
      }
    } catch {
      toast.error(t("schedules.failedToDeleteSchedule"));
    }
  };

  const handleMarkCompleted = async (scheduleId: number) => {
    const result = await markScheduleCompleted(scheduleId, true);
    if (result.success) {
      toast.success(t("schedules.scheduleMarkedAsCompleted"));
      await loadSchedules();
    } else {
      toast.error(result.error || t("schedules.failedToUpdateSchedule"));
    }
  };

  const handleMarkNotCompleted = async (scheduleId: number) => {
    const result = await markScheduleCompleted(scheduleId, false);
    if (result.success) {
      toast.success(t("schedules.scheduleMarkedAsNotCompleted"));
      await loadSchedules();
    } else {
      toast.error(result.error || t("schedules.failedToUpdateSchedule"));
    }
  };

  const handleCreateNewFromDetails = useCallback(() => {
    setIsDetailsModalOpen(false);
    setIsCreateModalOpen(true);
  }, []);

  const calendarEvents = schedules.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: schedule.dateTime,
    extendedProps: {
      description: schedule.description,
      location: schedule.location,
      completed: schedule.completed,
      client: schedule.client,
    },
  }));

  return {
    isPortuguese,
    calendarLocale,
    calendarEvents,
    isLoading,
    isCreateModalOpen,
    isDetailsModalOpen,
    selectedDate,
    selectedDateSchedules,
    isCreatingSchedule,
    setIsCreateModalOpen,
    setIsDetailsModalOpen,
    handleDateClick,
    handleCreateSchedule,
    handleDeleteSchedule,
    handleMarkCompleted,
    handleMarkNotCompleted,
    handleCreateNewFromDetails,
  };
};
