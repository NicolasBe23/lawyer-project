import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { ClientProcessesProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
export const ClientProcesses = ({
  processes,
  formatDate,
}: ClientProcessesProps) => {
  const router = useRouter();
  const t = useTranslations();
  return (
    <Card className="bg-gray-900 border border-white/10 shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>
            {t("processes.title")} ({processes.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {processes.length > 0 ? (
          <div className="space-y-4">
            {processes.map((process) => (
              <div
                key={process.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                onClick={() => {
                  const processIdentifier = process.documentId || process.id;
                  router.push(`/dashboard/processes/${processIdentifier}`);
                }}
              >
                <div>
                  <h4 className="font-semibold">{process.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("processes.process")}: {process.processNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("processes.start")}: {formatDate(process.startDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      process.processStatus === "active"
                        ? "bg-green-500/15 text-green-400"
                        : process.processStatus === "completed"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {process.processStatus === "active"
                      ? t("clients.active")
                      : process.processStatus === "completed"
                        ? t("clients.completed")
                        : t("clients.archived")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {t("clients.noProcessesFound")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
