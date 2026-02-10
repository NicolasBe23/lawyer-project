import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ClientsChartProps } from "@/types/types";
import { useLocale, useTranslations } from "next-intl";

export const ClientsChart = ({ clientsData }: ClientsChartProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const clientsByMonth = Array.from({ length: 12 }, (_, monthIndex) => {
    const currentYear = new Date().getFullYear();

    const clientsInMonth = clientsData.filter((client) => {
      const dateField = client.attributes.createdAt;
      if (!dateField) return false;

      const clientDate = new Date(dateField);
      return (
        clientDate.getMonth() === monthIndex &&
        clientDate.getFullYear() === currentYear
      );
    }).length;

    return {
      month: new Date(0, monthIndex).toLocaleString(locale, {
        month: "short",
      }),
      clients: clientsInMonth,
    };
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{t("dashboard.clientsByMonths")}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={clientsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tickCount={5} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="clients"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
