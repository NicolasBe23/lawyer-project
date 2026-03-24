import { DocumentData } from "@/types/types";
import { blocksToText } from "@/lib/helpers/richTextHelpers";
import { strapiApi } from "@/lib/strapi";

export const getAllDocuments = async (): Promise<{
  data: DocumentData[];
  error: string | null;
}> => {
  try {
    const { data } = await strapiApi.get(
      "/process-documents?populate[process][populate][0]=client&populate[file]=*&sort[0]=createdAt:desc"
    );

    const normalizedDocuments = (data.data || []).map(
      (doc: DocumentData & { description?: unknown }) => ({
        ...doc,
        description: blocksToText(doc.description),
      })
    );

    return { data: normalizedDocuments, error: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch documents";
    console.error("Error fetching documents:", err);
    return { data: [], error: errorMessage };
  }
};
