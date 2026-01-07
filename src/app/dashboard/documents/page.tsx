"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { DocumentData, DocumentFormData } from "@/types/types";
import { DocumentsHeader } from "@/components/document/DocumentsHeader";
import { DocumentsList } from "@/components/document/DocumentsList";
import { DocumentEmptyState } from "@/components/document/DocumentEmptyState";
import { CreateDocumentModal } from "@/components/document/CreateDocumentModal";
import { EditDocumentModal } from "@/components/document/EditDocumentModal";
import { DeleteDocumentModal } from "@/components/document/DeleteDocumentModal";
import {
  fetchDocuments,
  handleDocumentCreate,
  handleDocumentUpdate,
  handleDocumentDelete,
  handleFileUpload,
  handleFileRemove,
  openDocumentFile,
} from "@/lib/helpers/documentHelpers";
import { formatDate } from "@/lib/helpers/dateHelpers";
import { toast } from "sonner";

export default function DocumentsPage() {
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
  const [documentToEdit, setDocumentToEdit] = useState<DocumentData | null>(
    null
  );
  const [documentToDelete, setDocumentToDelete] = useState<DocumentData | null>(
    null
  );

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const processId = searchParams.get("processId");

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchDocuments(processId);
    if (error) {
      setError(error);
    } else {
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
      const { success, error } = await handleDocumentCreate(
        formData,
        processId
      );
      if (!success && error) {
        toast.error(error);
        return;
      }
      if (error) {
        toast.error(error);
      }
      toast.success("Document created successfully");
      setShowCreateModal(false);
      loadDocuments();
    } catch {
      toast.error("Failed to create document");
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
      const { success, error } = await handleDocumentUpdate(
        documentToEdit,
        data
      );
      if (!success) {
        toast.error(error || "Failed to update document");
        return;
      }
      toast.success("Document updated successfully");
      setShowEditModal(false);
      setDocumentToEdit(null);
      loadDocuments();
    } catch {
      toast.error("Failed to update document");
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
      const { success, error } = await handleDocumentDelete(documentToDelete);
      if (!success) {
        toast.error(error || "Failed to delete document");
        return;
      }
      toast.success("Document deleted successfully");
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      loadDocuments();
    } catch {
      toast.error("Failed to delete document");
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
      const { success, error } = await handleFileUpload(doc, file);
      if (!success) {
        toast.error(error || "Failed to upload file");
        return;
      }
      toast.success("File uploaded successfully");
      loadDocuments();
    } catch {
      toast.error("Failed to upload file");
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
      const { success, error } = await handleFileRemove(doc);
      if (!success) {
        toast.error(error || "Failed to remove file");
        return;
      }
      toast.success("File removed successfully");
      loadDocuments();
    } catch {
      toast.error("Failed to remove file");
    } finally {
      setRemovingFileDocId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Loading documents..." size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <DocumentsHeader
        processId={processId}
        onBackClick={() => router.push(`/dashboard/processes/${processId}`)}
        onAddClick={() => setShowCreateModal(true)}
      />

      {error && <p className="text-red-600">{error}</p>}

      {documents.length > 0 ? (
        <DocumentsList
          documents={documents}
          processId={processId}
          uploadingDocId={uploadingDocId}
          removingFileDocId={removingFileDocId}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onOpenFile={handleOpenFile}
          onUploadClick={handleUploadClick}
          onFileUpload={onFileUpload}
          onRemoveFile={handleRemoveFile}
          fileInputRefs={fileInputRefs}
          formatDate={formatDate}
        />
      ) : (
        <DocumentEmptyState
          processId={processId}
          onAddClick={() => setShowCreateModal(true)}
        />
      )}

      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateDocument}
        processId={processId || undefined}
        isLoading={actionLoading}
      />

      {documentToEdit && (
        <EditDocumentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setDocumentToEdit(null);
          }}
          onSave={handleEditDocument}
          document={documentToEdit}
          isLoading={actionLoading}
        />
      )}

      {documentToDelete && (
        <DeleteDocumentModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          documentTitle={documentToDelete.title}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
}
