import Link from "next/link";
import { Users, FileText, Calendar, Folder } from "lucide-react";
import { StatCard } from "@/components/statCard/page";
import { StatsCardsProps } from "@/types/types";
import { useTranslations } from "next-intl";
export const StatsCards = ({ stats }: StatsCardsProps) => {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-4 gap-6">
      <Link href="/dashboard/clients">
        <StatCard
          title={t("dashboard.clients")}
          value={stats.clients}
          subtitle={`+${stats.clientsThisMonth} ${t("dashboard.thisMonth")}`}
          icon={Users}
          iconColor="text-blue-600"
        />
      </Link>
      <Link href="/dashboard/processes">
        <StatCard
          title={t("dashboard.processes")}
          value={stats.processes}
          subtitle={`${stats.activeProcesses} ${t("dashboard.active")}`}
          icon={FileText}
          iconColor="text-green-600"
        />
      </Link>
      <Link href="/dashboard/schedules">
        <StatCard
          title={t("dashboard.schedules")}
          value={stats.schedules}
          subtitle={`${stats.schedulesThisWeek} ${t("dashboard.thisWeek")}`}
          icon={Calendar}
          iconColor="text-yellow-600"
        />
      </Link>
      <Link href="/dashboard/documents">
        <StatCard
          title={t("dashboard.documents")}
          value={stats.documents}
          subtitle={`${stats.newDocuments} ${t("dashboard.new")}`}
          icon={Folder}
          iconColor="text-purple-600"
        />
      </Link>
    </div>
  );
};
