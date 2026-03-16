import { DocumentData } from "@/types/types";
import { blocksToText } from "@/lib/helpers/richTextHelpers";

const API_URL = "/api/strapi";

export const getAllDocuments = async (): Promise<{
  data: DocumentData[];
  error: string | null;
}> => {
  try {
    const res = await fetch(
      `${API_URL}/process-documents?populate[process][populate][0]=client&populate[file]=*&sort[0]=createdAt:desc`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    const normalizedDocuments = (responseData.data || []).map(
      (doc: DocumentData & { description?: unknown }) => ({
        ...doc,
        description: blocksToText(doc.description),
      })
    );

    return {
      data: normalizedDocuments,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch documents";
    console.error("Error fetching documents:", err);
    return {
      data: [],
      error: errorMessage,
    };
  }
};
