import Link from "next/link";
import { Users, FileText, Calendar, Folder } from "lucide-react";
import { StatCard } from "@/components/statCard/page";
import { StatsCardsProps } from "@/types/types";

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      <Link href="/dashboard/clients">
        <StatCard
          title="Clients"
          value={stats.clients}
          subtitle={`+${stats.clientsThisMonth} this month`}
          icon={Users}
          iconColor="text-blue-600"
        />
      </Link>
      <Link href="/dashboard/processes">
        <StatCard
          title="Processes"
          value={stats.processes}
          subtitle={`${stats.activeProcesses} active`}
          icon={FileText}
          iconColor="text-green-600"
        />
      </Link>
      <Link href="/dashboard/schedules">
        <StatCard
          title="Schedules"
          value={stats.schedules}
          subtitle={`${stats.schedulesThisWeek} this week`}
          icon={Calendar}
          iconColor="text-yellow-600"
        />
      </Link>
      <Link href="/dashboard/documents">
        <StatCard
          title="Documents"
          value={stats.documents}
          subtitle={`${stats.newDocuments} new`}
          icon={Folder}
          iconColor="text-purple-600"
        />
      </Link>
    </div>
  );
};
