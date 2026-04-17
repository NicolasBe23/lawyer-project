import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardProps } from "@/types/types";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="bg-gray-900 border border-white/10 shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Icon className={iconColor} />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
