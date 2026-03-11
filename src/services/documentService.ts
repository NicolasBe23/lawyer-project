import { DocumentData } from "@/types/types";
import {
  blocksToText,
  descriptionToBlocks,
} from "@/lib/helpers/richTextHelpers";

const API_PROXY_URL = "/api/strapi";
const STRAPI_ASSET_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const getErrorMessageFromResponse = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const errorData = await response.json().catch(() => ({}));
    return errorData?.error?.message || fallback;
  }

  const errorText = await response.text().catch(() => "");
  return errorText || fallback;
};

const normalizeDocumentData = (
  document: DocumentData | null,
): DocumentData | null => {
  if (!document) {
    return null;
  }

  return {
    ...document,
    description: blocksToText(
      (document as DocumentData & { description?: unknown }).description,
    ),
  };
};

const buildDocumentPayload = (
  documentData: {
    title?: string;
    description?: string | null;
    process?: number;
  },
  descriptionMode: "plain" | "blocks",
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
  documentId: string,
): Promise<{
  data: DocumentData | null;
  error: string | null;
}> => {
  try {
    const res = await fetch(
      `${API_PROXY_URL}/process-documents/${documentId}?populate[process][populate][0]=client&populate[file]=*`,
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    return {
      data: normalizeDocumentData(responseData.data || null),
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch document";
    console.error("Error fetching document:", err);
    return {
      data: null,
      error: errorMessage,
    };
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
    const baseHeaders = {
      "Content-Type": "application/json",
    };

    let res = await fetch(`${API_PROXY_URL}/process-documents`, {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify({
        data: buildDocumentPayload(documentData, "plain"),
      }),
    });

    let errorData: any = null;
    if (!res.ok) {
      errorData = await res.json().catch(() => ({}));
      const hasDescription =
        typeof documentData.description === "string" &&
        documentData.description.trim().length > 0;

      // Some Strapi setups store rich text as Blocks and reject plain strings.
      if (hasDescription) {
        res = await fetch(`${API_PROXY_URL}/process-documents`, {
          method: "POST",
          headers: baseHeaders,
          body: JSON.stringify({
            data: buildDocumentPayload(documentData, "blocks"),
          }),
        });
      }
    }

    if (!res.ok) {
      const fallbackErrorData = await res.json().catch(() => ({}));
      const finalErrorData = fallbackErrorData?.error
        ? fallbackErrorData
        : errorData;
      console.error("Create document error:", finalErrorData);
      throw new Error(
        finalErrorData?.error?.message || `HTTP error! status: ${res.status}`,
      );
    }

    const responseData = await res.json();
    return {
      data: normalizeDocumentData(responseData.data || null),
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create document";
    console.error("Error creating document:", err);
    return {
      data: null,
      error: errorMessage,
    };
  }
};

export const updateDocument = async (
  documentId: string,
  documentData: { title?: string; description?: string | null },
  numericId?: number,
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

    const baseHeaders = {
      "Content-Type": "application/json",
    };

    let res = await fetch(`${API_PROXY_URL}/process-documents/${idToUse}`, {
      method: "PUT",
      headers: baseHeaders,
      body: JSON.stringify({
        data: buildDocumentPayload(documentData, "plain"),
      }),
    });

    let errorData: any = null;
    if (!res.ok) {
      errorData = await res.json().catch(() => ({}));
      const hasDescription =
        typeof documentData.description === "string" &&
        documentData.description.trim().length > 0;

      // Retry with Blocks payload to support Strapi rich-text fields.
      if (hasDescription) {
        res = await fetch(`${API_PROXY_URL}/process-documents/${idToUse}`, {
          method: "PUT",
          headers: baseHeaders,
          body: JSON.stringify({
            data: buildDocumentPayload(documentData, "blocks"),
          }),
        });
      }
    }

    if (!res.ok) {
      const fallbackErrorData = await res.json().catch(() => ({}));
      const finalErrorData = fallbackErrorData?.error
        ? fallbackErrorData
        : errorData;
      console.error("Update document error:", finalErrorData);
      throw new Error(
        finalErrorData?.error?.message || `HTTP error! status: ${res.status}`,
      );
    }

    const responseData = await res.json();
    return {
      data: normalizeDocumentData(responseData.data || null),
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update document";
    console.error("Error updating document:", err);
    return {
      data: null,
      error: errorMessage,
    };
  }
};

export const deleteDocument = async (
  documentId: string,
  numericId?: number,
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

    const res = await fetch(`${API_PROXY_URL}/process-documents/${idToUse}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete document";
    console.error("Error deleting document:", err);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const uploadDocumentFile = async (
  documentId: string,
  file: File,
  numericId?: number,
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const uploadRes = await fetch(`${API_PROXY_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorMessage = await getErrorMessageFromResponse(
        uploadRes,
        `Upload failed! status: ${uploadRes.status}`,
      );
      throw new Error(errorMessage);
    }

    const uploadedFiles = await uploadRes.json();

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

    const linkRes = await fetch(
      `${API_PROXY_URL}/process-documents/${docNumericId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            file: uploadedFile.id,
          },
        }),
      },
    );

    if (!linkRes.ok) {
      const errorData = await linkRes.json().catch(() => ({}));
      console.error("Link file error:", errorData);
      throw new Error(
        errorData?.error?.message ||
          "File uploaded but linking failed. Please try again.",
      );
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to upload file";
    console.error("Error uploading file:", err);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const getFileDownloadUrl = (fileUrl: string): string => {
  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }
  return `${STRAPI_ASSET_URL}${fileUrl}`;
};

export const removeDocumentFile = async (
  documentId: string,
  numericId?: number,
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

    const res = await fetch(
      `${API_PROXY_URL}/process-documents/${docNumericId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            file: null,
          },
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message ||
          `Failed to remove file. Status: ${res.status}`,
      );
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to remove file";
    console.error("Error removing file:", err);
    return {
      success: false,
      error: errorMessage,
    };
  }
};
