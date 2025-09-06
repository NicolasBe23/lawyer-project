"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CreateScheduleModal } from "@/components/schedule/CreateScheduleModal";
import { getAllSchedules } from "@/services/getAllSchedules";
import { createSchedule } from "@/services/createSchedule";
import { Schedule, ScheduleFormData } from "@/types/types";
import { toast } from "sonner";

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
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

  const handleDateClick = useCallback((info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  }, []);

  const handleCreateSchedule = useCallback(
    async (scheduleData: ScheduleFormData) => {
      setIsCreatingSchedule(true);
      try {
        const { error } = await createSchedule(scheduleData);
        if (error) {
          toast.error(`Error creating schedule: ${error}`);
        } else {
          toast.success("Schedule created successfully!");
          setIsModalOpen(false);
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
    <div className="p-2">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-300 pb-4 w-full">
        <div className="flex flex-col">
          <p className="text-2xl">Schedule</p>
        </div>
        <div>
          <p>Click on a date to create a new schedule</p>
        </div>
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
          eventBackgroundColor="#101828"
          eventBorderColor="#101828"
          eventTextColor="#ffffff"
        />
      )}

      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSchedule}
        selectedDate={selectedDate}
        isLoading={isCreatingSchedule}
      />
    </div>
  );
}
