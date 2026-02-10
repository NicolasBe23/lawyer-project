import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ProcessDatesProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const ProcessDates = ({
  startDate,
  completionDate,
  createdAt,
  formatDate,
}: ProcessDatesProps) => {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{t("processes.dates")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("processes.startDate")}:</p>
          <p className="font-medium">{formatDate(startDate)}</p>
        </div>
        {completionDate && (
          <div>
            <p className="text-sm text-muted-foreground">
              {t("processes.completionDate")}:
            </p>
            <p className="font-medium">{formatDate(completionDate)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{t("processes.created")}:</p>
          <p className="font-medium">{formatDate(createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
