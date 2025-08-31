"use client";

import { useEffect, useState } from "react";
import { Process } from "@/types/types";
import { getAllProcesses } from "@/services/getAllProcesses";

export const RecentProcessesCard = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  const getProcessStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "In progress";
      case "completed":
        return "Completed";
      case "archived":
        return "Archived";
      default:
        return "Pending";
    }
  };

  useEffect(() => {
    getAllProcesses().then((res) => {
      const sortedProcesses = res.data
        .filter((process) => process && process.title)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);
      setProcesses(sortedProcesses);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Last Processes</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading processes...</p>
      ) : processes.length === 0 ? (
        <p className="text-sm text-gray-500">No process found.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {processes.map((process) => (
            <li key={process.id} className="p-2 border rounded">
              {process.title} – {getProcessStatusText(process.processStatus)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
