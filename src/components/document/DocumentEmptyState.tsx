import { Card, CardContent } from "@/components/ui/card";
import { DocumentEmptyStateProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const DocumentEmptyState = ({
  processId,
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
      </CardContent>
    </Card>
  );
};
