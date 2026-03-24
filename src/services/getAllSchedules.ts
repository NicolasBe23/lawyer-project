import { Schedule } from "@/types/types";
import { strapiApi } from "@/lib/strapi";

export const getAllSchedules = async (): Promise<{
  data: Schedule[];
  error: string | null;
}> => {
  try {
    const { data } = await strapiApi.get(
      "/schedules?populate=*&sort[0]=createdAt:desc"
    );
    return { data: data.data || [], error: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch schedules";
    console.error("Error fetching schedules:", err);
    return { data: [], error: errorMessage };
  }
};
