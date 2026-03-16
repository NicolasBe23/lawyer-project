import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { CheckCircle, PlayCircle, Clock } from "lucide-react";
import { ProcessesChartProps } from "@/types/types";
import { useTranslations } from "next-intl";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export const ProcessesChart = ({ stats }: ProcessesChartProps) => {
  const t = useTranslations();
  const processesByStatus = [
    {
      name: t("dashboard.active"),
      value: stats.activeProcesses,
      icon: PlayCircle,
      color: COLORS[1],
    },
    {
      name: t("dashboard.completed"),
      value: stats.processes - stats.activeProcesses,
      icon: CheckCircle,
      color: COLORS[0],
    },
    { name: t("dashboard.pending"), value: 0, icon: Clock, color: COLORS[2] },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{t("dashboard.processesByStatus")}</CardTitle>
      </CardHeader>
      <CardContent className="h-72 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="70%">
          <PieChart>
            <Pie
              data={processesByStatus}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={3}
            >
              {processesByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none" }}
              formatter={(value, name) => [`${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex gap-6 mt-4">
          {processesByStatus.map((status, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <status.icon size={16} color={status.color} />
              <span className="text-sm text-muted-foreground">
                {status.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
