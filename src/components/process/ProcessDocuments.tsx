"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Eye } from "lucide-react";
import { ExtendedProcessDocumentsProps, StrapiFile } from "@/types/types";
import { useRouter } from "next/navigation";
import { getFileDownloadUrl } from "@/services/documentService";
import { useTranslations } from "next-intl";

export const ProcessDocuments = ({
  documents,
  formatDate,
  processId,
}: ExtendedProcessDocumentsProps) => {
  const t = useTranslations();
  const router = useRouter();

  const handleViewAllDocuments = () => {
    router.push(`/dashboard/documents?processId=${processId}`);
  };

  const handleOpenFile = (e: React.MouseEvent, file: StrapiFile) => {
    e.stopPropagation();
    const fileUrl = getFileDownloadUrl(file.url);
    window.open(fileUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{t("processes.processDocuments")}</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleViewAllDocuments}>
            <ExternalLink className="w-4 h-4 mr-2" />
            {documents && documents.length > 0
              ? t("documents.manage")
              : t("documents.add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("documents.created")}: {formatDate(doc.createdAt)}
                  </p>
                </div>
                {doc.file && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleOpenFile(e, doc.file as StrapiFile)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t("documents.open")}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {t("processes.noDocumentsAttached")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
