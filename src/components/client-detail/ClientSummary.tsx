import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientSummaryProps } from "@/types/types";

export const ClientSummary = ({
  client,
  processes,
  schedules,
  formatDate,
}: ClientSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Processes</span>
          <span className="font-semibold">{processes.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Active Processes
          </span>
          <span className="font-semibold">
            {processes.filter((p) => p.processStatus === "active").length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Schedules</span>
          <span className="font-semibold">{schedules.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Client since</span>
          <span className="font-semibold">
            {formatDate(client.attributes.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
