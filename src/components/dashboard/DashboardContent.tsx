"use client";

import { DashboardStats } from "@/types/types";
import Header from "@/components/header/page";
import {
  StatsCards,
  ClientsChart,
  ProcessesChart,
  RecentClientsCard,
  RecentProcessesCard,
  UpcomingSchedulesCard,
  PendingDocumentsCard,
} from "@/components/dashboard";
import { useGetDashboardStats } from "@/services/getDashboardStats";
import { useTranslations } from "next-intl";
import { Loading } from "@/components/ui/loading";
import { DashboardContentProps } from "@/types/types";

export const DashboardContent = ({ user }: DashboardContentProps) => {
  const t = useTranslations();
  const { stats, clientsData, loading } = useGetDashboardStats();

  if (loading) {
    return (
      <div className="p-6">
        <Loading text={t("dashboard.loadingStats")} size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header username={user.username} />

      <StatsCards stats={stats ?? ({} as DashboardStats)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
        <div className="min-w-0 lg:col-span-3">
          <ClientsChart clientsData={clientsData} />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <ProcessesChart stats={stats ?? ({} as DashboardStats)} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <RecentClientsCard />
        <RecentProcessesCard />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <UpcomingSchedulesCard />
        <PendingDocumentsCard />
      </div>
    </div>
  );
};
