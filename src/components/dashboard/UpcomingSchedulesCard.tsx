"use client";

import { useEffect, useState } from "react";
import { getAllSchedules } from "@/services/getAllSchedules";
import { Schedule } from "@/types/types";

export const UpcomingSchedulesCard = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    getAllSchedules().then((res) => {
      const upcomingSchedules = res.data
        .filter((schedule) => schedule?.completed === false)
        .sort(
          (a, b) =>
            new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        )
        .slice(0, 3);

      setSchedules(upcomingSchedules);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Next Schedules</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading schedules...</p>
      ) : schedules.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming schedules.</p>
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
