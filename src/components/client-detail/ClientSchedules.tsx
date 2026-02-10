import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ClientSchedulesProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
export const ClientSchedules = ({
  schedules,
  formatDateTime,
}: ClientSchedulesProps) => {
  const router = useRouter();
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>{t("schedules.title")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.slice(0, 5).map((schedule) => (
              <div
                key={schedule.id}
                className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                onClick={() => router.push(`/dashboard/schedules`)}
              >
                <h4 className="font-medium text-sm">{schedule.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(schedule.dateTime)}
                </p>
                {schedule.location && (
                  <p className="text-xs text-muted-foreground">
                    {schedule.location}
                  </p>
                )}
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      schedule.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {schedule.completed
                      ? t("clients.completed")
                      : t("clients.pending")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 text-sm">
            {t("schedules.noSchedulesFound")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
