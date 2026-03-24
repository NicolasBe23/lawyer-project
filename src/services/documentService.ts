import { DocumentData } from "@/types/types";
import {
  blocksToText,
  descriptionToBlocks,
} from "@/lib/helpers/richTextHelpers";
import { strapiApi } from "@/lib/strapi";

const STRAPI_ASSET_URL =
  process.env.NEXT_PUBLIC_STRAPI_ASSET_URL ||
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "http://localhost:1337";

const normalizeDocumentData = (
  document: DocumentData | null
): DocumentData | null => {
  if (!document) return null;
  return {
    ...document,
    description: blocksToText(
      (document as DocumentData & { description?: unknown }).description
    ),
  };
};

const buildDocumentPayload = (
  documentData: {
    title?: string;
    description?: string | null;
    process?: number;
  },
  descriptionMode: "plain" | "blocks"
) => {
  const payload: {
    title?: string;
    description?: string | null | ReturnType<typeof descriptionToBlocks>;
    process?: number;
  } = {};

  if (typeof documentData.title !== "undefined") {
    payload.title = documentData.title;
  }

  if (typeof documentData.process !== "undefined") {
    payload.process = documentData.process;
  }

  if (typeof documentData.description !== "undefined") {
    const normalizedDescription =
      typeof documentData.description === "string"
        ? documentData.description.trim()
        : documentData.description;

    if (normalizedDescription === null || normalizedDescription === "") {
      payload.description = null;
    } else if (descriptionMode === "blocks") {
      payload.description = descriptionToBlocks(normalizedDescription);
    } else {
      payload.description = normalizedDescription;
    }
  }

  return payload;
};

export const getDocumentById = async (
  documentId: string
): Promise<{
  data: DocumentData | null;
  error: string | null;
}> => {
  try {
    const { data } = await strapiApi.get(
      `/process-documents/${documentId}?populate[process][populate][0]=client&populate[file]=*`
    );
    return { data: normalizeDocumentData(data.data || null), error: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch document";
    console.error("Error fetching document:", err);
    return { data: null, error: errorMessage };
  }
};

export const createDocument = async (documentData: {
  title: string;
  description?: string;
  process?: number;
}): Promise<{
  data: DocumentData | null;
  error: string | null;
}> => {
  try {
    const hasDescription =
      typeof documentData.description === "string" &&
      documentData.description.trim().length > 0;

    let responseData;
    try {
      const res = await strapiApi.post("/process-documents", {
        data: buildDocumentPayload(documentData, "plain"),
      });
      responseData = res.data;
    } catch (firstErr) {
      // Some Strapi setups store rich text as Blocks and reject plain strings.
      if (hasDescription) {
        const res = await strapiApi.post("/process-documents", {
          data: buildDocumentPayload(documentData, "blocks"),
        });
        responseData = res.data;
      } else {
        throw firstErr;
      }
    }

    return {
      data: normalizeDocumentData(responseData.data || null),
      error: null,
    };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Failed to create document";
    console.error("Error creating document:", err);
    return { data: null, error: errorMessage };
  }
};

export const updateDocument = async (
  documentId: string,
  documentData: { title?: string; description?: string | null },
  numericId?: number
): Promise<{
  data: DocumentData | null;
  error: string | null;
}> => {
  try {
    let idToUse: string | number = numericId || documentId;
    if (!numericId && isNaN(Number(documentId))) {
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        idToUse = docRes.data.id;
      }
    }

    const hasDescription =
      typeof documentData.description === "string" &&
      documentData.description.trim().length > 0;

    let responseData;
    try {
      const res = await strapiApi.put(`/process-documents/${idToUse}`, {
        data: buildDocumentPayload(documentData, "plain"),
      });
      responseData = res.data;
    } catch (firstErr) {
      // Retry with Blocks payload to support Strapi rich-text fields.
      if (hasDescription) {
        const res = await strapiApi.put(`/process-documents/${idToUse}`, {
          data: buildDocumentPayload(documentData, "blocks"),
        });
        responseData = res.data;
      } else {
        throw firstErr;
      }
    }

    return {
      data: normalizeDocumentData(responseData.data || null),
      error: null,
    };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Failed to update document";
    console.error("Error updating document:", err);
    return { data: null, error: errorMessage };
  }
};

export const deleteDocument = async (
  documentId: string,
  numericId?: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    let idToUse: string | number = numericId || documentId;
    if (!numericId && isNaN(Number(documentId))) {
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        idToUse = docRes.data.id;
      }
    }

    await strapiApi.delete(`/process-documents/${idToUse}`);
    return { success: true, error: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete document";
    console.error("Error deleting document:", err);
    return { success: false, error: errorMessage };
  }
};

export const uploadDocumentFile = async (
  documentId: string,
  file: File,
  numericId?: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const uploadRes = await strapiApi.post("/upload", formData);
    const uploadedFiles = uploadRes.data;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error("No file was uploaded");
    }

    const uploadedFile = uploadedFiles[0];

    let docNumericId = numericId;
    if (!docNumericId) {
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        docNumericId = docRes.data.id;
      }
    }

    if (!docNumericId) {
      throw new Error("Could not get document numeric ID");
    }

    await strapiApi.put(`/process-documents/${docNumericId}`, {
      data: { file: uploadedFile.id },
    });

    return { success: true, error: null };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Failed to upload file";
    console.error("Error uploading file:", err);
    return { success: false, error: errorMessage };
  }
};

export const getFileDownloadUrl = (fileUrl: string): string => {
  if (fileUrl.startsWith("http")) return fileUrl;
  return `${STRAPI_ASSET_URL}${fileUrl}`;
};

export const removeDocumentFile = async (
  documentId: string,
  numericId?: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    let docNumericId = numericId;
    if (!docNumericId) {
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        docNumericId = docRes.data.id;
      }
    }

    if (!docNumericId) {
      throw new Error("Could not get document numeric ID");
    }

    await strapiApi.put(`/process-documents/${docNumericId}`, {
      data: { file: null },
    });

    return { success: true, error: null };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Failed to remove file";
    console.error("Error removing file:", err);
    return { success: false, error: errorMessage };
  }
};
