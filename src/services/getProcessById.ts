import { Process, Schedule } from "@/types/types";
import { blocksToText } from "@/lib/helpers/richTextHelpers";
import { strapiApi } from "@/lib/strapi";

export const getProcessById = async (
  id: string
): Promise<{
  data: Process | null;
  error: string | null;
}> => {
  try {
    const populateQuery =
      "populate[client]=*&populate[process_documents]=*&populate[schedules][populate][client]=*";

    let processData: Process | null = null;
    const isNumericId = !isNaN(Number(id));

    if (isNumericId) {
      try {
        const res = await strapiApi.get(`/processes/${id}?${populateQuery}`);
        processData = res.data.data || null;
      } catch {
        try {
          const res = await strapiApi.get(
            `/processes?filters[id][$eq]=${id}&${populateQuery}`
          );
          processData =
            (res.data.data || []).find(
              (process: Process) => process.id === Number(id)
            ) || null;
        } catch {
          // ignore
        }
      }
    } else {
      try {
        const res = await strapiApi.get(
          `/processes?filters[documentId][$eq]=${id}&${populateQuery}`
        );
        processData =
          (res.data.data || []).find(
            (process: Process) => process.documentId === id
          ) || null;
      } catch {
        // ignore
      }
    }

    if (!processData) {
      throw new Error("Process not found");
    }

    let allSchedules = processData?.schedules || [];
    const currentProcessId = processData.id;

    try {
      const processSchedulesRes = await strapiApi.get(
        `/schedules?populate[client]=*&populate[process]=*&filters[process][id][$eq]=${currentProcessId}`
      );
      const processSchedules = processSchedulesRes.data.data || [];
      const existingIds = allSchedules.map((s: Schedule) => s.id);
      const newSchedules = processSchedules.filter(
        (s: Schedule) => !existingIds.includes(s.id)
      );
      allSchedules = [...allSchedules, ...newSchedules];
    } catch {
      // ignore
    }

    if (processData?.client?.id) {
      try {
        const clientSchedulesRes = await strapiApi.get(
          `/schedules?populate[client]=*&populate[process]=*&filters[client][id][$eq]=${processData.client.id}`
        );
        const clientSchedules = clientSchedulesRes.data.data || [];
        const relevantSchedules = clientSchedules.filter(
          (schedule: Schedule) => !schedule.process?.id
        );
        const existingIds = allSchedules.map((s: Schedule) => s.id);
        const newSchedules = relevantSchedules.filter(
          (s: Schedule) => !existingIds.includes(s.id)
        );
        allSchedules = [...allSchedules, ...newSchedules];
      } catch {
        // ignore
      }
    }

    const normalizedProcess: Process = {
      ...processData,
      description: blocksToText(
        (processData as Process & { description?: unknown }).description
      ),
      process_documents: (processData.process_documents || []).map((doc) => ({
        ...doc,
        description: blocksToText(
          (doc as typeof doc & { description?: unknown }).description
        ),
      })),
      schedules: allSchedules,
    };

    return { data: normalizedProcess, error: null };
  } catch {
    return { data: null, error: "Failed to fetch process" };
  }
};
