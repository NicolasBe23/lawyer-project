"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/statCard/page";
import { Users, FileText, Calendar, Folder } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const statsData = [
  {
    title: "Clients",
    value: 120,
    subtitle: "+15 this month",
    icon: Users,
    iconColor: "text-blue-600",
  },
  {
    title: "Processes",
    value: 35,
    subtitle: "+3 active",
    icon: FileText,
    iconColor: "text-green-600",
  },
  {
    title: "Schedules",
    value: 12,
    subtitle: "2 this week",
    icon: Calendar,
    iconColor: "text-yellow-600",
  },
  {
    title: "Documents",
    value: 58,
    subtitle: "5 new",
    icon: Folder,
    iconColor: "text-purple-600",
  },
];

const clientsByMonth = [
  { month: "Jan", clients: 10 },
  { month: "Feb", clients: 15 },
  { month: "Mar", clients: 20 },
  { month: "Apr", clients: 25 },
  { month: "May", clients: 22 },
  { month: "Jun", clients: 30 },
];

const processesByStatus = [
  { name: "Ativos", value: 20 },
  { name: "Finalizados", value: 10 },
  { name: "Pendentes", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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

        if (
          token.startsWith("google_") ||
          token.startsWith("temp_") ||
          token.startsWith("fallback_")
        ) {
          return;
        }

        if (
          token &&
          !token.startsWith("google_") &&
          !token.startsWith("temp_") &&
          !token.startsWith("fallback_")
        ) {
          const response = await axios.get(
            `${
              process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
            }/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data) {
            setUser(response.data as User);
            Cookies.set("strapi_user", JSON.stringify(response.data), {
              expires: 7,
            });
          }
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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Clients by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
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
      </div>
    </div>
  );
}
