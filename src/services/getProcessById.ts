import { Process, Schedule } from "@/types/types";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const getProcessById = async (
  id: string
): Promise<{
  data: Process | null;
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/api/processes/${id}?populate[client]=*&populate[process_documents]=*&populate[schedules][populate][client]=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const processData = responseData.data;

    let allSchedules = processData?.schedules || [];

    if (processData?.client?.id) {
      const clientSchedulesResponse = await fetch(
        `${API_URL}/api/schedules?populate[client]=*&populate[process]=*&filters[client][id][$eq]=${processData.client.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (clientSchedulesResponse.ok) {
        const clientSchedulesData = await clientSchedulesResponse.json();
        const clientSchedules = clientSchedulesData.data || [];

        const currentProcessId = parseInt(id);
        const currentClientId = processData.client.id;

        const relevantSchedules = clientSchedules.filter(
          (schedule: Schedule) => {
            const scheduleProcessId = schedule.process?.id;
            const scheduleClientId = schedule.client?.id;

            return (
              scheduleProcessId === currentProcessId ||
              (!scheduleProcessId && scheduleClientId === currentClientId)
            );
          }
        );

        const existingIds = allSchedules.map((s: Schedule) => s.id);
        const newSchedules = relevantSchedules.filter(
          (s: Schedule) => !existingIds.includes(s.id)
        );
        allSchedules = [...allSchedules, ...newSchedules];
      }
    }

    return {
      data: {
        ...processData,
        schedules: allSchedules,
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Failed to fetch process",
    };
  }
};
