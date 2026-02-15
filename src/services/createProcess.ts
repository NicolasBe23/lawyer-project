import { processService } from "@/lib/strapi";
import { Process } from "@/types/types";

interface CreateProcessPayload {
  processNumber: string;
  title: string;
  description?: string;
  processStatus: "active" | "completed" | "archived";
  startDate: string;
  completionDate?: string;
  client?: number;
}

export const createProcess = async (
  processData: CreateProcessPayload,
): Promise<{
  data: Process | null;
  error: string | null;
}> => {
  try {
    const response = await processService.create(
      processData as unknown as Process,
    );
    return {
      data: response.data?.data || null,
      error: null,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create process";
    return {
      data: null,
      error: errorMessage,
    };
  }
};
