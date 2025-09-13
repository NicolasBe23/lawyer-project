import { Process } from "@/types/types";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const getProcessById = async (
  id: string
): Promise<{
  data: Process | null;
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/api/processes/${id}?populate[client]=*&populate[process_documents]=*&populate[schedules][populate][0]=client`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return {
      data: responseData.data || null,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch process";
    console.error("Error fetching process:", err);
    return {
      data: null,
      error: errorMessage,
    };
  }
};
