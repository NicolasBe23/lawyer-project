import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ProcessSchedulesProps } from "@/types/types";

export const ProcessSchedules = ({ schedules }: ProcessSchedulesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Schedules</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedules && schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
              >
                <div>
                  <p className="font-medium">{schedule.title}</p>
                  {schedule.description && (
                    <p className="text-sm text-muted-foreground">
                      {schedule.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {new Date(schedule.dateTime).toLocaleString("en-US")}
                  </p>
                  {schedule.location && (
                    <p className="text-sm text-muted-foreground">
                      Location: {schedule.location}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    schedule.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {schedule.completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No schedules found
          </p>
        )}
      </CardContent>
    </Card>
  );
};
