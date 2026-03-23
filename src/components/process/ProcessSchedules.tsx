import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ProcessSchedulesProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const ProcessSchedules = ({ schedules }: ProcessSchedulesProps) => {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{t("schedules.title")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedules && schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex flex-col gap-3 rounded-lg border p-3 hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{schedule.title}</p>
                  {schedule.description && (
                    <p className="text-sm text-muted-foreground">
                      {schedule.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {new Date(schedule.dateTime).toLocaleString("pt-BR")}
                  </p>
                  {schedule.location && (
                    <p className="text-sm text-muted-foreground">
                      {t("schedules.location")}: {schedule.location}
                    </p>
                  )}
                </div>
                <span
                  className={`self-start rounded-full px-2 py-1 text-xs sm:self-auto ${
                    schedule.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {schedule.completed
                    ? t("dashboard.completed")
                    : t("dashboard.pending")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {t("schedules.noSchedulesFound")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
