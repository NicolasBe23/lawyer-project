"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Schedule, ScheduleDetailsModalProps } from "@/types/types";
import { MapPin, User, Clock, FileText, Trash2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getStatusBadge } from "@/components/constants/page";
import { useTranslations } from "next-intl";
import {
  formatDateLong,
  formatTime,
  isDatePast,
  isDateToday,
} from "@/lib/helpers/dateHelpers";

export const ScheduleDetailsModal = ({
  isOpen,
  onClose,
  schedules,
  selectedDate,
  onCreateNew,
  onDeleteSchedule,
  onMarkCompleted,
  onMarkNotCompleted,
}: ScheduleDetailsModalProps) => {
  const t = useTranslations();
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(schedules);

  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

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

  const getScheduleStatus = (schedule: Schedule) => {
    if (schedule.completed) return "completed";
    if (isDatePast(schedule.dateTime)) return "overdue";
    if (isDateToday(schedule.dateTime)) return "today";
    return "upcoming";
  };

  const handleMarkCompleted = async (scheduleId: number) => {
    if (!onMarkCompleted) return;

    try {
      await onMarkCompleted(scheduleId);

      setLocalSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === scheduleId
            ? { ...schedule, completed: true }
            : schedule,
        ),
      );
    } catch {
      console.error(t("schedules.errorMarkingScheduleAsCompleted"));
    }
  };

  const handleMarkNotCompleted = async (scheduleId: number) => {
    if (!onMarkNotCompleted) return;

    try {
      await onMarkNotCompleted(scheduleId);

      setLocalSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === scheduleId
            ? { ...schedule, completed: false }
            : schedule,
        ),
      );
    } catch {
      console.error(t("schedules.errorMarkingScheduleAsNotCompleted"));
    }
  };

  const handleDeleteClick = (scheduleId: number) => {
    setScheduleToDelete(scheduleId);
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete || !onDeleteSchedule) return;

    setIsDeleting(true);
    try {
      await onDeleteSchedule(scheduleToDelete);

      setLocalSchedules((prev) =>
        prev.filter((schedule) => schedule.id !== scheduleToDelete),
      );

      setScheduleToDelete(null);
    } catch {
      console.error(t("schedules.errorDeletingSchedule"));
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setScheduleToDelete(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("schedules.schedulesForDate", { date: formatDateLong(selectedDate) })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {localSchedules.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {t("schedules.noSchedulesForThisDate")}
              </p>
            ) : (
              localSchedules.map((schedule) => {
                const clientName = getClientName(schedule);
                const status = getScheduleStatus(schedule);

                return (
                  <div
                    key={schedule.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {schedule.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            status,
                          )}`}
                        >
                          {status === "completed"
                            ? t("dashboard.completed")
                            : status === "overdue"
                              ? t("schedules.needsConfirmation")
                              : status === "today"
                                ? t("schedules.today")
                                : t("schedules.upcoming")}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(schedule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

                    {status === "overdue" && !schedule.completed && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          onClick={() => handleMarkCompleted(schedule.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {t("schedules.markCompleted")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkNotCompleted(schedule.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {t("schedules.notDone")}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={onCreateNew}>
                {t("schedules.createNewSchedule")}
              </Button>
              <Button onClick={onClose}>{t("common.close")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!scheduleToDelete} onOpenChange={cancelDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("schedules.confirmDelete")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>
              {t("schedules.deleteScheduleConfirmation")}
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("documents.deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {t("common.delete")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
