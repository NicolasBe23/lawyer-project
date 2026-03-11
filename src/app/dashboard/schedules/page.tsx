"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CreateScheduleModal } from "@/components/schedule/CreateScheduleModal";
import { ScheduleDetailsModal } from "@/components/schedule/ScheduleDetailsModal";
import { useTranslations } from "next-intl";
import SplitText from "@/components/ui/SplitText";
import { useSchedulesPage } from "@/lib/useSchedulesPage";

export default function CalendarPage() {
  const t = useTranslations();
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
    handleCreateSchedule,
    handleDeleteSchedule,
    handleMarkCompleted,
    handleMarkNotCompleted,
    handleCreateNewFromDetails,
  } = useSchedulesPage();

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
