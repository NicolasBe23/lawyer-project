import { DocumentData, DocumentFormData } from "@/types/types";
import { getAllDocuments } from "@/services/getAllDocuments";
import {
  createDocument,
  deleteDocument,
  updateDocument,
  uploadDocumentFile,
  removeDocumentFile,
  getFileDownloadUrl,
} from "@/services/documentService";

export const fetchDocuments = async (processId: string | null) => {
  const res = await getAllDocuments();
  if (res.error) {
    return { data: [], error: res.error };
  }

  const filteredDocs = processId
    ? res.data.filter((doc) => doc.process?.id === Number(processId))
    : res.data;

  return { data: filteredDocs, error: null };
};

export const handleDocumentCreate = async (
  formData: DocumentFormData,
  processId: string | null
): Promise<{ success: boolean; error: string | null }> => {
  const result = await createDocument({
    title: formData.title,
    description: formData.description,
    process: processId ? Number(processId) : undefined,
  });

  if (result.error) {
    return { success: false, error: result.error };
  }

  // Upload file if provided
  if (formData.file && result.data?.id) {
    const uploadResult = await uploadDocumentFile(
      String(result.data.id),
      formData.file,
      result.data.id
    );
    if (uploadResult.error) {
      return {
        success: true,
        error: "Document created but file upload failed",
      };
    }
  }

  return { success: true, error: null };
};

export const handleDocumentUpdate = async (
  document: DocumentData,
  data: { title: string; description?: string | null }
): Promise<{ success: boolean; error: string | null }> => {
  const docId = document.documentId || String(document.id);
  const result = await updateDocument(docId, data, document.id);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, error: null };
};

export const handleDocumentDelete = async (
  document: DocumentData
): Promise<{ success: boolean; error: string | null }> => {
  const docId = document.documentId || String(document.id);
  const result = await deleteDocument(docId, document.id);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, error: null };
};

export const handleFileUpload = async (
  document: DocumentData,
  file: File
): Promise<{ success: boolean; error: string | null }> => {
  const docId = document.documentId || String(document.id);
  const result = await uploadDocumentFile(docId, file, document.id);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, error: null };
};

export const handleFileRemove = async (
  document: DocumentData
): Promise<{ success: boolean; error: string | null }> => {
  const docId = document.documentId || String(document.id);
  const result = await removeDocumentFile(docId, document.id);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, error: null };
};

export const openDocumentFile = (doc: DocumentData) => {
  if (doc.file?.url) {
    const fileUrl = getFileDownloadUrl(doc.file.url);
    window.open(fileUrl, "_blank");
  }
};
