"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CreateScheduleModal } from "@/components/schedule/CreateScheduleModal";
import { ScheduleDetailsModal } from "@/components/schedule/ScheduleDetailsModal";
import { getAllSchedules } from "@/services/getAllSchedules";
import { createSchedule } from "@/services/createSchedule";
import { Schedule, ScheduleFormData } from "@/types/types";
import { toast } from "sonner";
import { deleteSchedule } from "@/services/updateSchedule";
import { markScheduleCompleted } from "@/services/updateSchedule";

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDateSchedules, setSelectedDateSchedules] = useState<
    Schedule[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getAllSchedules();
      if (error) {
        toast.error(`Error loading schedules: ${error}`);
      } else {
        setSchedules(data);
      }
    } catch {
      toast.error("Error loading schedules");
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
            scheduleDateTime.getTimezoneOffset() * 60000
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
    [schedules]
  );

  const handleCreateSchedule = useCallback(
    async (scheduleData: ScheduleFormData) => {
      setIsCreatingSchedule(true);
      try {
        const { error } = await createSchedule(scheduleData);
        if (error) {
          toast.error(`Error creating schedule: ${error}`);
        } else {
          toast.success("Schedule created successfully!");
          setIsCreateModalOpen(false);
          loadSchedules();
        }
      } catch {
        toast.error("Error creating schedule");
      } finally {
        setIsCreatingSchedule(false);
      }
    },
    []
  );

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        toast.success("Schedule deleted successfully");
        loadSchedules();
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to delete schedule");
      }
    } catch {
      toast.error("Failed to delete schedule");
    }
  };

  const handleMarkCompleted = async (scheduleId: number) => {
    const result = await markScheduleCompleted(scheduleId, true);
    if (result.success) {
      toast.success("Schedule marked as completed");
      loadSchedules();
    } else {
      toast.error(result.error || "Failed to update schedule");
    }
  };

  const handleMarkNotCompleted = async (scheduleId: number) => {
    const result = await markScheduleCompleted(scheduleId, false);
    if (result.success) {
      toast.success("Schedule marked as not completed");
      loadSchedules();
    } else {
      toast.error(result.error || "Failed to update schedule");
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
        <h1 className="text-2xl">Schedules</h1>
        <p className="text-gray-600">
          Click on a date to see schedules or create a new one
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-lg">Loading schedules...</div>
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
          height="auto"
          locale="en"
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
