import { DocumentData } from "@/types/types";
import Cookies from "js-cookie";
import { blocksToText } from "@/lib/helpers/richTextHelpers";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const getAllDocuments = async (): Promise<{
  data: DocumentData[];
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const fetchPromise = fetch(
      `${API_URL}/api/process-documents?populate[process][populate][0]=client&populate[file]=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    const [res] = await Promise.all([fetchPromise, delayPromise]);

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
