import { Client } from "@/types/types";

const API_URL = "/api/strapi";

export const getAllClients = async (): Promise<{
  data: Client[];
  error: string | null;
}> => {
  try {
    const res = await fetch(`${API_URL}/clients?sort[0]=createdAt:desc`);

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
