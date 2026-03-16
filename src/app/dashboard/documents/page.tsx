"use client";

import { Loading } from "@/components/ui/loading";
import { DocumentsHeader } from "@/components/document/DocumentsHeader";
import { DocumentsList } from "@/components/document/DocumentsList";
import { DocumentEmptyState } from "@/components/document/DocumentEmptyState";
import { CreateDocumentModal } from "@/components/document/CreateDocumentModal";
import { EditDocumentModal } from "@/components/document/EditDocumentModal";
import { DeleteDocumentModal } from "@/components/document/DeleteDocumentModal";
import { formatDate } from "@/lib/helpers/dateHelpers";
import { useTranslations } from "next-intl";
import { useDocumentsPage } from "@/lib/useDocumentsPage";

export default function DocumentsPage() {
  const t = useTranslations();
  const {
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
  } = useDocumentsPage();

  if (loading) {
    return (
      <div className="p-6">
        <Loading text={t("documents.loadingDocuments")} size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <DocumentsHeader
        processId={processId}
        showBackButton={Boolean(associatedProcessIdentifier)}
        onBackClick={handleBackClick}
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
          onClose={closeEditModal}
          onSave={handleEditDocument}
          document={documentToEdit}
          isLoading={actionLoading}
        />
      )}

      {documentToDelete && (
        <DeleteDocumentModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          documentTitle={documentToDelete.title}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
}
