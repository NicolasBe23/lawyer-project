import { DocumentData } from "@/types/types";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const getAuthHeaders = () => {
  const token = Cookies.get("strapi_token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getDocumentById = async (
  documentId: string
): Promise<{
  data: DocumentData | null;
  error: string | null;
}> => {
  try {
    const headers = getAuthHeaders();

    const res = await fetch(
      `${API_URL}/api/process-documents/${documentId}?populate[process][populate][0]=client&populate[file]=*`,
      { headers }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    return {
      data: responseData.data || null,
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
    const headers = getAuthHeaders();

    const res = await fetch(`${API_URL}/api/process-documents`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: documentData }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Create document error:", errorData);
      throw new Error(
        errorData?.error?.message || `HTTP error! status: ${res.status}`
      );
    }

    const responseData = await res.json();
    return {
      data: responseData.data || null,
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
  numericId?: number
): Promise<{
  data: DocumentData | null;
  error: string | null;
}> => {
  try {
    const headers = getAuthHeaders();

    let idToUse: string | number = numericId || documentId;
    if (!numericId && isNaN(Number(documentId))) {
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        idToUse = docRes.data.id;
      }
    }

    const res = await fetch(`${API_URL}/api/process-documents/${idToUse}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: documentData }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    return {
      data: responseData.data || null,
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
  numericId?: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const headers = getAuthHeaders();

    let idToUse: string | number = numericId || documentId;
    if (!numericId && isNaN(Number(documentId))) {
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        idToUse = docRes.data.id;
      }
    }

    const res = await fetch(`${API_URL}/api/process-documents/${idToUse}`, {
      method: "DELETE",
      headers,
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
  numericId?: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("files", file);

    console.log("Step 1: Uploading file...");

    const uploadRes = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}));
      console.error("Upload error response:", errorData);
      throw new Error(
        errorData?.error?.message ||
          `Upload failed! status: ${uploadRes.status}`
      );
    }

    const uploadedFiles = await uploadRes.json();
    console.log("Uploaded files:", uploadedFiles);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error("No file was uploaded");
    }

    const uploadedFile = uploadedFiles[0];

    let docNumericId = numericId;
    if (!docNumericId) {
      console.log("Step 2: Fetching document to get numeric ID...");
      const docRes = await getDocumentById(documentId);
      if (docRes.data) {
        docNumericId = docRes.data.id;
      }
    }

    if (!docNumericId) {
      throw new Error("Could not get document numeric ID");
    }

    console.log(
      "Step 3: Linking file ID",
      uploadedFile.id,
      "to document numeric ID",
      docNumericId
    );

    const linkRes = await fetch(
      `${API_URL}/api/process-documents/${docNumericId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            file: uploadedFile.id,
          },
        }),
      }
    );

    if (!linkRes.ok) {
      const errorData = await linkRes.json().catch(() => ({}));
      console.error("Link file error:", errorData);
      throw new Error(
        errorData?.error?.message ||
          "File uploaded but linking failed. Please try again."
      );
    }

    console.log("File linked successfully!");

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
  return `${API_URL}${fileUrl}`;
};

export const removeDocumentFile = async (
  documentId: string,
  numericId?: number
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const token = Cookies.get("strapi_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

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
      `${API_URL}/api/process-documents/${docNumericId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            file: null,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message ||
          `Failed to remove file. Status: ${res.status}`
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
