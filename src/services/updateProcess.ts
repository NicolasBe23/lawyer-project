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

export const updateProcessDetails = async (
  processId: string,
  data: {
    processNumber?: string;
    title?: string;
    description?: string;
    startDate?: string;
    completionDate?: string;
  }
): Promise<{
  data: Process | null;
  error: string | null;
}> => {
  try {
    const response = await processService.update(processId, data);
    return {
      data: response.data?.data || null,
      error: null,
    };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Failed to update process";
    return {
      data: null,
      error: errorMessage,
    };
  }
};
