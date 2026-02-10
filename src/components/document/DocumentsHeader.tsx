import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { DocumentsHeaderProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const DocumentsHeader = ({
  processId,
  onBackClick,
  onAddClick,
}: DocumentsHeaderProps) => {
  const t = useTranslations();
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {processId && (
            <Button variant="outline" onClick={onBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("documents.backToProcess")}
            </Button>
          )}
        </div>
        <Button onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          {t("documents.addDocument")}
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{t("documents.title")}</h1>
        <p className="text-muted-foreground">
          {processId
            ? t("documents.documentsRelatedToThisProcess")
            : t("documents.allDocumentsRegistered")}
        </p>
      </div>
    </>
  );
};
