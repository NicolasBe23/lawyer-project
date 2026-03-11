import { Client, Process, Schedule } from "@/types/types";

const API_URL = "/api/strapi";

export const getClientById = async (
  id: string
): Promise<{
  data: Client | null;
  processes: Process[];
  schedules: Schedule[];
  error: string | null;
}> => {
  try {
    const clientResponse = await fetch(`${API_URL}/clients/${id}?populate=*`);

    if (!clientResponse.ok) {
      throw new Error(`HTTP error! status: ${clientResponse.status}`);
    }

    const clientData = await clientResponse.json();

    const processesResponse = await fetch(
      `${API_URL}/processes?populate=*&filters[client][id][$eq]=${id}`
    );

    const processesData = processesResponse.ok
      ? await processesResponse.json()
      : { data: [] };

    const schedulesResponse = await fetch(
      `${API_URL}/schedules?populate=*&filters[client][id][$eq]=${id}`
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
