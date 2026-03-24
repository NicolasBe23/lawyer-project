import { Client } from "@/types/types";
import { strapiApi } from "@/lib/strapi";

export const getAllClients = async (): Promise<{
  data: Client[];
  error: string | null;
}> => {
  try {
    const { data } = await strapiApi.get("/clients?sort[0]=createdAt:desc");
    return { data: data.data || [], error: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch clients";
    console.error("Error fetching clients:", err);
    return { data: [], error: errorMessage };
  }
};
