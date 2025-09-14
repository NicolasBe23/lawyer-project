import { scheduleService } from "@/lib/strapi";
import { Schedule } from "@/types/types";

export const deleteSchedule = async (
  scheduleId: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    await scheduleService.delete(scheduleId.toString());
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete schedule";
    return { success: false, error: errorMessage };
  }
};

export const markScheduleCompleted = async (
  scheduleId: number,
  completed: boolean
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    await scheduleService.update(scheduleId.toString(), {
      completed,
    } as Schedule);
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update schedule";
    return { success: false, error: errorMessage };
  }
};
