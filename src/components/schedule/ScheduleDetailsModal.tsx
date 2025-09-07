"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Schedule, ScheduleDetailsModalProps } from "@/types/types";
import { Calendar, MapPin, User, Clock, FileText } from "lucide-react";

export const ScheduleDetailsModal = ({
  isOpen,
  onClose,
  schedules,
  selectedDate,
  onCreateNew,
}: ScheduleDetailsModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getClientName = (schedule: Schedule): string | null => {
    if (!schedule.client) return null;

    if (schedule.client.attributes?.name) {
      return schedule.client.attributes.name;
    }

    if ("name" in schedule.client && typeof schedule.client.name === "string") {
      return schedule.client.name;
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Calendar className="w-5 h-5" />
            Schedules - {formatDate(selectedDate)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No schedules found for this date.
            </div>
          ) : (
            schedules.map((schedule) => {
              const clientName = getClientName(schedule);

              return (
                <div
                  key={schedule.id}
                  className={`p-4 rounded-lg border ${
                    schedule.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{schedule.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        schedule.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {schedule.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(schedule.dateTime)}h</span>
                    </div>

                    {schedule.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                    )}

                    {clientName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{clientName}</span>
                      </div>
                    )}

                    {schedule.description && (
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-0.5" />
                        <span>{schedule.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onCreateNew}>
              Create New Schedule
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
