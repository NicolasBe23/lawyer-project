import { Schedule } from "@/types/types";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const getAllSchedules = async (): Promise<{
  data: Schedule[];
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const fetchPromise = fetch(`${API_URL}/api/schedules?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    const [res] = await Promise.all([fetchPromise, delayPromise]);

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
