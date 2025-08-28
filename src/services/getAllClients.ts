import { Client } from "@/types/types";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const getAllClients = async (): Promise<{
  data: Client[];
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const fetchPromise = fetch(`${API_URL}/api/clients`, {
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
      err instanceof Error ? err.message : "Failed to fetch clients";
    console.error("Error fetching clients:", err);
    return {
      data: [],
      error: errorMessage,
    };
  }
};
