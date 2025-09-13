import { Process, StrapiResponse } from "@/types/types";
import { processService } from "@/lib/strapi";

export const getAllProcesses = async (): Promise<{
  data: Process[];
  error: string | null;
}> => {
  try {
    const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    const [response] = await Promise.all([
      processService.getAll(),
      delayPromise,
    ]);

    return {
      data: (response.data as StrapiResponse<Process>).data || [],
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch processes";
    console.error("Error fetching processes:", err);
    return {
      data: [],
      error: errorMessage,
    };
  }
};
