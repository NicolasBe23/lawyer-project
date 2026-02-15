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

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const populateQuery =
      "populate[client]=*&populate[process_documents]=*&populate[schedules][populate][client]=*";

    let processData: Process | null = null;
    const isNumericId = !isNaN(Number(id));

    if (isNumericId) {
      const directResponse = await fetch(
        `${API_URL}/api/processes/${id}?${populateQuery}`,
        { headers }
      );

      if (directResponse.ok) {
        const directData = await directResponse.json();
        processData = directData.data || null;
      } else {
        const fallbackResponse = await fetch(
          `${API_URL}/api/processes?filters[id][$eq]=${id}&${populateQuery}`,
          { headers }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          processData = fallbackData.data?.[0] || null;
        }
      }
    } else {
      const byDocumentIdResponse = await fetch(
        `${API_URL}/api/processes?filters[documentId][$eq]=${id}&${populateQuery}`,
        { headers }
      );

      if (byDocumentIdResponse.ok) {
        const byDocumentIdData = await byDocumentIdResponse.json();
        processData = byDocumentIdData.data?.[0] || null;
      }
    }

    if (!processData) {
      throw new Error("Process not found");
    }

    let allSchedules = processData?.schedules || [];

    if (processData?.client?.id) {
      const clientSchedulesResponse = await fetch(
        `${API_URL}/api/schedules?populate[client]=*&populate[process]=*&filters[client][id][$eq]=${processData.client.id}`,
        {
          headers,
        }
      );

      if (clientSchedulesResponse.ok) {
        const clientSchedulesData = await clientSchedulesResponse.json();
        const clientSchedules = clientSchedulesData.data || [];

        const currentProcessId = processData.id;
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
