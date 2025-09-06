import { ScheduleFormData } from "@/types/types";
import { scheduleService } from "@/lib/strapi";

export const createSchedule = async (
  scheduleData: ScheduleFormData
): Promise<{
  data: any;
  error: string | null;
}> => {
  try {
    const response = await scheduleService.create(scheduleData as any);
    return {
      data: response.data,
      error: null,
    };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message ||
      err.message ||
      "Failed to create schedule";
    console.error("Error creating schedule:", err);
    return {
      data: null,
      error: errorMessage,
    };
  }
};
