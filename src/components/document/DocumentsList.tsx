import { DocumentsListProps } from "@/types/types";
import { DocumentCard } from "./DocumentCard";

export const DocumentsList = ({
  documents,
  processId,
  uploadingDocId,
  removingFileDocId,
  onEditClick,
  onDeleteClick,
  onOpenFile,
  onUploadClick,
  onFileUpload,
  onRemoveFile,
  fileInputRefs,
  formatDate,
}: DocumentsListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          processId={processId}
          uploadingDocId={uploadingDocId}
          removingFileDocId={removingFileDocId}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onOpenFile={onOpenFile}
          onUploadClick={onUploadClick}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
          fileInputRef={(el) => {
            fileInputRefs.current[doc.id] = el;
          }}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

