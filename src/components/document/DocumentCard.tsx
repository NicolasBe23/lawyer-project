import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { DocumentCardProps, StrapiFile } from "@/types/types";

export const DocumentCard = ({
  document: doc,
  processId,
  uploadingDocId,
  removingFileDocId,
  onEditClick,
  onDeleteClick,
  onOpenFile,
  onUploadClick,
  onFileUpload,
  onRemoveFile,
  fileInputRef,
  formatDate,
}: DocumentCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5" />
            {doc.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => onEditClick(e, doc)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={(e) => onDeleteClick(e, doc)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {/* Description - flexible area */}
        <div className="flex-1">
          {doc.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {doc.description}
            </p>
          )}
        </div>

        {/* Fixed bottom section */}
        <div className="mt-auto space-y-1">
          <p className="text-xs text-muted-foreground">
            Created: {formatDate(doc.createdAt)}
          </p>
          {doc.process && !processId && (
            <p className="text-xs text-muted-foreground">
              Process: {doc.process.title}
            </p>
          )}
        </div>

        {/* File section - always at bottom */}
        {doc.file ? (
          <div className="space-y-2 pt-3 mt-3 border-t">
            <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-lg">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {(doc.file as StrapiFile).name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(doc.file as StrapiFile).ext?.toUpperCase()} •{" "}
                  {((doc.file as StrapiFile).size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => onOpenFile(e, doc)}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={(e) => onRemoveFile(e, doc)}
                disabled={removingFileDocId === doc.id}
              >
                <X className="w-4 h-4 mr-1" />
                {removingFileDocId === doc.id ? "..." : "Remove"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-3 mt-3 border-t">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => onFileUpload(e, doc)}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => onUploadClick(e, doc.id)}
              disabled={uploadingDocId === doc.id}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadingDocId === doc.id ? "Uploading..." : "Attach File"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

