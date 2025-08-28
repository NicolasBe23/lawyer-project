"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User } from "@/types/types";
import Header from "@/components/header/page";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ClientsChart } from "@/components/dashboard/ClientsChart";
import { ProcessesChart } from "@/components/dashboard/ProcessesChart";
import { useGetDashboardStats } from "@/services/getDashboardStats";

export default function DashboardPage() {
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

  if (!user) return <p>Loading user...</p>;
  if (loading || !stats) return <p>Loading stats...</p>;

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
    </div>
  );
}
