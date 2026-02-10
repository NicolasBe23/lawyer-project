"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User } from "@/types/types";
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

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { stats, clientsData, loading } = useGetDashboardStats();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("strapi_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const userFromCookie = Cookies.get("strapi_user");
        if (userFromCookie) {
          setUser(JSON.parse(userFromCookie));
        }
      } catch {
        const userFromCookie = Cookies.get("strapi_user");
        if (userFromCookie) {
          setUser(JSON.parse(userFromCookie));
        }
      }
    };

    fetchUser();
  }, [router]);

  if (!user) return <p>{t("dashboard.loadingUser")}</p>;
  if (loading || !stats) return <p>{t("dashboard.loadingStats")}</p>;

  return (
    <div className="space-y-6">
      <Header />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <ClientsChart clientsData={clientsData} />
        </div>
        <div className="col-span-2">
          <ProcessesChart stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <RecentClientsCard />
        <RecentProcessesCard />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <UpcomingSchedulesCard />
        <PendingDocumentsCard />
      </div>
    </div>
  );
}
