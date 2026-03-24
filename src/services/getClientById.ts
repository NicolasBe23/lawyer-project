import { Client, Process, Schedule } from "@/types/types";
import { strapiApi } from "@/lib/strapi";

export const getClientById = async (
  id: string
): Promise<{
  data: Client | null;
  processes: Process[];
  schedules: Schedule[];
  error: string | null;
}> => {
  try {
    const [clientRes, processesRes, schedulesRes] = await Promise.all([
      strapiApi.get(`/clients/${id}?populate=*`),
      strapiApi.get(`/processes?populate=*&filters[client][id][$eq]=${id}`),
      strapiApi.get(`/schedules?populate=*&filters[client][id][$eq]=${id}`),
    ]);

    return {
      data: clientRes.data.data || null,
      processes: processesRes.data.data || [],
      schedules: schedulesRes.data.data || [],
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch client";
    console.error("Error fetching client:", err);
    return { data: null, processes: [], schedules: [], error: errorMessage };
  }
};
