"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { DocumentData, DocumentFormData } from "@/types/types";
import {
  fetchDocuments,
  handleDocumentCreate,
  handleDocumentDelete,
  handleDocumentUpdate,
  handleFileRemove,
  handleFileUpload,
  openDocumentFile,
} from "@/lib/helpers/documentHelpers";

export const useDocumentsPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const processId = searchParams.get("processId");

  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);
  const [removingFileDocId, setRemovingFileDocId] = useState<number | null>(
    null
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DocumentData | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentData | null>(
    null
  );

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const associatedProcessIdentifier = useMemo(() => {
    if (processId) return processId;

    const firstAssociatedProcess = documents.find((doc) => doc.process)?.process;
    if (!firstAssociatedProcess) return null;

    return firstAssociatedProcess.documentId || String(firstAssociatedProcess.id);
  }, [processId, documents]);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await fetchDocuments(processId);

    if (fetchError) {
      setError(fetchError);
    } else {
      setError(null);
      setDocuments(data);
    }

    setLoading(false);
  }, [processId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleCreateDocument = async (formData: DocumentFormData) => {
    setActionLoading(true);
    try {
      const { success, error: createError } = await handleDocumentCreate(
        formData,
        processId
      );
      if (!success && createError) {
        toast.error(createError);
        return;
      }
      if (createError) {
        toast.error(createError);
      }
      toast.success(t("documents.documentCreatedSuccessfully"));
      setShowCreateModal(false);
      await loadDocuments();
    } catch {
      toast.error(t("documents.failedToCreateDocument"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent, doc: DocumentData) => {
    e.stopPropagation();
    setDocumentToEdit(doc);
    setShowEditModal(true);
  };

  const handleEditDocument = async (data: {
    title: string;
    description?: string | null;
  }) => {
    if (!documentToEdit) return;

    setActionLoading(true);
    try {
      const { success, error: updateError } = await handleDocumentUpdate(
        documentToEdit,
        data
      );
      if (!success) {
        toast.error(updateError || t("documents.failedToUpdateDocument"));
        return;
      }
      toast.success(t("documents.documentUpdatedSuccessfully"));
      setShowEditModal(false);
      setDocumentToEdit(null);
      await loadDocuments();
    } catch {
      toast.error(t("documents.failedToUpdateDocument"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, doc: DocumentData) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    setActionLoading(true);
    try {
      const { success, error: deleteError } = await handleDocumentDelete(
        documentToDelete
      );
      if (!success) {
        toast.error(deleteError || t("documents.failedToDeleteDocument"));
        return;
      }
      toast.success(t("documents.documentDeletedSuccessfully"));
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      await loadDocuments();
    } catch {
      toast.error(t("documents.failedToDeleteDocument"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenFile = (e: React.MouseEvent, doc: DocumentData) => {
    e.stopPropagation();
    openDocumentFile(doc);
  };

  const handleUploadClick = (e: React.MouseEvent, docId: number) => {
    e.stopPropagation();
    fileInputRefs.current[docId]?.click();
  };

  const onFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    doc: DocumentData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocId(doc.id);
    try {
      const { success, error: uploadError } = await handleFileUpload(doc, file);
      if (!success) {
        toast.error(uploadError || t("documents.failedToUploadFile"));
        return;
      }
      toast.success(t("documents.fileUploadedSuccessfully"));
      await loadDocuments();
    } catch {
      toast.error(t("documents.failedToUploadFile"));
    } finally {
      setUploadingDocId(null);
      if (fileInputRefs.current[doc.id]) {
        fileInputRefs.current[doc.id]!.value = "";
      }
    }
  };

  const handleRemoveFile = async (e: React.MouseEvent, doc: DocumentData) => {
    e.stopPropagation();

    setRemovingFileDocId(doc.id);
    try {
      const { success, error: removeError } = await handleFileRemove(doc);
      if (!success) {
        toast.error(removeError || t("documents.failedToRemoveFile"));
        return;
      }
      toast.success(t("documents.fileRemovedSuccessfully"));
      await loadDocuments();
    } catch {
      toast.error(t("documents.failedToRemoveFile"));
    } finally {
      setRemovingFileDocId(null);
    }
  };

  const handleBackClick = () => {
    if (associatedProcessIdentifier) {
      router.push(`/dashboard/processes/${associatedProcessIdentifier}`);
      return;
    }
    router.push("/dashboard/processes");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setDocumentToEdit(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  return {
    processId,
    associatedProcessIdentifier,
    documents,
    loading,
    error,
    actionLoading,
    uploadingDocId,
    removingFileDocId,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    documentToEdit,
    documentToDelete,
    fileInputRefs,
    setShowCreateModal,
    closeEditModal,
    closeDeleteModal,
    handleBackClick,
    handleCreateDocument,
    handleEditClick,
    handleEditDocument,
    handleDeleteClick,
    handleConfirmDelete,
    handleOpenFile,
    handleUploadClick,
    onFileUpload,
    handleRemoveFile,
  };
};
