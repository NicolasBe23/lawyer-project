"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { CreateScheduleModal } from "@/components/schedule/CreateScheduleModal";
import { ScheduleDetailsModal } from "@/components/schedule/ScheduleDetailsModal";
import { useTranslations } from "next-intl";
import SplitText from "@/components/ui/SplitText";
import { useSchedulesPage } from "@/lib/useSchedulesPage";
import { useEffect, useMemo, useState } from "react";

const getDateKey = (dateTime: string) => {
  const scheduleDateTime = new Date(dateTime);
  const localDate = new Date(
    scheduleDateTime.getTime() - scheduleDateTime.getTimezoneOffset() * 60000,
  );
  return localDate.toISOString().split("T")[0];
};

export default function CalendarPage() {
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);
  const {
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
    openSchedulesForDate,
    handleCreateSchedule,
    handleDeleteSchedule,
    handleMarkCompleted,
    handleMarkNotCompleted,
    handleCreateNewFromDetails,
    schedules,
  } = useSchedulesPage();

  const mobileSchedules = useMemo(
    () =>
      [...schedules].sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
      ),
    [schedules],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="mb-4">
      <div className="mb-8 flex w-full flex-col gap-2 border-b-2 border-gray-300 p-2 pb-4 md:flex-row md:items-center md:justify-between">
        <SplitText
          text={t("schedules.title")}
          tag="h1"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="center"
          className="text-2xl"
        />
        <SplitText
          text={t("schedules.clickDateToSeeOrCreate")}
          tag="p"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="center"
          className="text-gray-600"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-lg">{t("schedules.loadingSchedules")}</div>
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          <Button
            className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800"
            onClick={() => {
              const today = new Date();
              const todayKey = `${today.getFullYear()}-${String(
                today.getMonth() + 1,
              ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              openSchedulesForDate(todayKey);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("schedules.createSchedule")}
          </Button>

          {mobileSchedules.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("schedules.noSchedulesFound")}
            </p>
          ) : (
            <div className="space-y-3">
              {mobileSchedules.map((schedule) => {
                const dateTime = new Date(schedule.dateTime);
                const isToday =
                  getDateKey(schedule.dateTime) ===
                  getDateKey(new Date().toISOString());
                return (
                  <button
                    key={schedule.id}
                    type="button"
                    onClick={() =>
                      openSchedulesForDate(getDateKey(schedule.dateTime))
                    }
                    className="w-full rounded-lg border bg-white p-3 text-left shadow-sm transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold">
                        {schedule.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          schedule.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {schedule.completed
                          ? t("dashboard.completed")
                          : t("schedules.needsConfirmation")}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {dateTime.toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                        {isToday ? ` • ${t("schedules.today")}` : ""}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {dateTime.toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {schedule.location && (
                        <p className="flex items-center gap-2 truncate">
                          <MapPin className="h-3.5 w-3.5" />
                          {schedule.location}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-170 md:min-w-0">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              dateClick={handleDateClick}
              events={calendarEvents}
              headerToolbar={{
                left: isMobile ? "prev,next" : "prev,next today",
                center: "title",
                right: isMobile
                  ? "dayGridMonth,timeGridDay"
                  : "dayGridMonth,timeGridWeek,timeGridDay",
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
          </div>
        </div>
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
