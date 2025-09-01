import { Client, Process, Schedule } from "@/types/types";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const getClientById = async (
  id: string
): Promise<{
  data: Client | null;
  processes: Process[];
  schedules: Schedule[];
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Fetch client data
    const clientResponse = await fetch(
      `${API_URL}/api/clients/${id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!clientResponse.ok) {
      throw new Error(`HTTP error! status: ${clientResponse.status}`);
    }

    const clientData = await clientResponse.json();

    // Fetch related processes
    const processesResponse = await fetch(
      `${API_URL}/api/processes?populate=*&filters[client][id][$eq]=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const processesData = processesResponse.ok
      ? await processesResponse.json()
      : { data: [] };

    // Fetch related schedules
    const schedulesResponse = await fetch(
      `${API_URL}/api/schedules?populate=*&filters[client][id][$eq]=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const schedulesData = schedulesResponse.ok
      ? await schedulesResponse.json()
      : { data: [] };

    return {
      data: clientData.data || null,
      processes: processesData.data || [],
      schedules: schedulesData.data || [],
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch client";
    console.error("Error fetching client:", err);
    return {
      data: null,
      processes: [],
      schedules: [],
      error: errorMessage,
    };
  }
};
