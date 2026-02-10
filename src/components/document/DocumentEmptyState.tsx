import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DocumentEmptyStateProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const DocumentEmptyState = ({
  processId,
  onAddClick,
}: DocumentEmptyStateProps) => {
  const t = useTranslations();
  return (
    <Card>
      <CardContent className="py-8">
        <p className="text-muted-foreground text-center">
          {processId
            ? t("documents.noDocumentsFoundForThisProcess")
            : t("documents.noDocumentsFound")}
        </p>
        <div className="flex justify-center mt-4">
          <Button onClick={onAddClick}>
            <Plus className="w-4 h-4 mr-2" />
            {t("documents.addFirstDocument")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
