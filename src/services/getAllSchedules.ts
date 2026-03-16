import { Schedule } from "@/types/types";

const API_URL = "/api/strapi";

export const getAllSchedules = async (): Promise<{
  data: Schedule[];
  error: string | null;
}> => {
  try {
    const res = await fetch(`${API_URL}/schedules?populate=*&sort[0]=createdAt:desc`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    return {
      data: responseData.data || [],
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch schedules";
    console.error("Error fetching schedules:", err);
    return {
      data: [],
      error: errorMessage,
    };
  }
};
