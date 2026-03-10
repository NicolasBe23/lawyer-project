"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { CreateScheduleModal } from "@/components/schedule/CreateScheduleModal";
import { ScheduleDetailsModal } from "@/components/schedule/ScheduleDetailsModal";
import { getAllSchedules } from "@/services/getAllSchedules";
import { createSchedule } from "@/services/createSchedule";
import { Schedule, ScheduleFormData } from "@/types/types";
import { toast } from "sonner";
import { deleteSchedule } from "@/services/updateSchedule";
import { markScheduleCompleted } from "@/services/updateSchedule";
import { useLocale, useTranslations } from "next-intl";
import SplitText from "@/components/ui/SplitText";

export default function CalendarPage() {
  const t = useTranslations();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDateSchedules, setSelectedDateSchedules] = useState<
    Schedule[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const locale = useLocale();
  const isPortuguese = locale.toLowerCase().startsWith("pt");
  const calendarLocale = isPortuguese ? "pt-br" : "en";
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
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
  };

  const handleDateClick = useCallback(
    (info: { dateStr: string }) => {
      const clickedDate = info.dateStr;

      const schedulesForDate = schedules.filter((schedule) => {
        const scheduleDateTime = new Date(schedule.dateTime);

        const localDate = new Date(
          scheduleDateTime.getTime() -
            scheduleDateTime.getTimezoneOffset() * 60000,
        );
        const formattedScheduleDate = localDate.toISOString().split("T")[0];

        return formattedScheduleDate === clickedDate;
      });

      setSelectedDate(clickedDate);

      if (schedulesForDate.length > 0) {
        setSelectedDateSchedules(schedulesForDate);
        setIsDetailsModalOpen(true);
      } else {
        setIsCreateModalOpen(true);
      }
    },
    [schedules],
  );

  const handleCreateSchedule = useCallback(
    async (scheduleData: ScheduleFormData) => {
      setIsCreatingSchedule(true);
      try {
        const { error } = await createSchedule(scheduleData);
        if (error) {
          toast.error(
            t("schedules.errorCreatingScheduleWithMessage", { error }),
          );
        } else {
          toast.success(t("schedules.scheduleCreatedSuccessfully"));
          setIsCreateModalOpen(false);
          loadSchedules();
        }
      } catch {
        toast.error(t("schedules.errorCreatingSchedule"));
      } finally {
        setIsCreatingSchedule(false);
      }
    },
    [],
  );

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        toast.success(t("schedules.scheduleDeletedSuccessfully"));
        loadSchedules();
        window.location.reload();
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
      loadSchedules();
    } else {
      toast.error(result.error || t("schedules.failedToUpdateSchedule"));
    }
  };

  const handleMarkNotCompleted = async (scheduleId: number) => {
    const result = await markScheduleCompleted(scheduleId, false);
    if (result.success) {
      toast.success(t("schedules.scheduleMarkedAsNotCompleted"));
      loadSchedules();
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

  return (
    <div>
      <div className="flex justify-between items-center p-2 border-b-2 border-gray-300 pb-4 w-full mb-8">
        <SplitText
          text={t("schedules.title")}
          tag="h1"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="left"
          className="text-2xl"
        />
        <SplitText
          text={t("schedules.clickDateToSeeOrCreate")}
          tag="p"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="left"
          className="text-gray-600"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-lg">{t("schedules.loadingSchedules")}</div>
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          dateClick={handleDateClick}
          events={calendarEvents}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={
            isPortuguese
              ? {
                  today: "Hoje",
                  month: "Mes",
                  week: "Semana",
                  day: "Dia",
                }
              : {
                  today: "Today",
                  month: "Month",
                  week: "Week",
                  day: "Day",
                }
          }
          allDayText={t("schedules.allDay")}
          height="auto"
          locale={calendarLocale}
          eventDisplay="block"
          eventBackgroundColor="#3f4552"
          eventBorderColor="#494f5a"
          eventTextColor="#ffffff"
        />
      )}

      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSchedule}
        selectedDate={selectedDate}
        isLoading={isCreatingSchedule}
      />

      <ScheduleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        schedules={selectedDateSchedules}
        selectedDate={selectedDate}
        onCreateNew={handleCreateNewFromDetails}
        onDeleteSchedule={handleDeleteSchedule}
        onMarkCompleted={handleMarkCompleted}
        onMarkNotCompleted={handleMarkNotCompleted}
      />
    </div>
  );
}
