import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientSummaryProps } from "@/types/types";
import { useTranslations } from "next-intl";
export const ClientSummary = ({
  client,
  processes,
  schedules,
  formatDate,
}: ClientSummaryProps) => {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("clients.summary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t("clients.totalProcesses")}
          </span>
          <span className="font-semibold">{processes.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t("clients.activeProcesses")}
          </span>
          <span className="font-semibold">
            {processes.filter((p) => p.processStatus === "active").length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t("schedules.title")}
          </span>
          <span className="font-semibold">{schedules.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t("clients.clientSince")}
          </span>
          <span className="font-semibold">
            {formatDate(client.attributes.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
