import { processService } from "@/lib/strapi";
import { Process } from "@/types/types";

export const updateProcessStatus = async (
  processId: string,
  status: "active" | "completed" | "archived"
): Promise<{
  data: Process | null;
  error: string | null;
}> => {
  try {
    const response = await processService.update(processId, {
      processStatus: status,
    });

    return {
      data: response.data as Process,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Failed to update process status",
    };
  }
};
