import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
  Tooltip,
} from "recharts";
import { DashboardStats } from "@/types/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface ProcessesChartProps {
  stats: DashboardStats;
}

export const ProcessesChart = ({ stats }: ProcessesChartProps) => {
  const processesByStatus = [
    { name: "Actives", value: stats.activeProcesses },
    { name: "Completed", value: stats.processes - stats.activeProcesses },
    { name: "Pending", value: 0 },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Processes by Status</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processesByStatus}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {processesByStatus.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
