"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Folder } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("strapi_token");

    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUser(res.data as User))
        .catch(() => setUser(null));
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Clients</CardTitle>
            <Users className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">120</p>
            <p className="text-sm text-gray-500">+15 this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Processes</CardTitle>
            <FileText className="text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">35</p>
            <p className="text-sm text-gray-500">+3 active</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedules</CardTitle>
            <Calendar className="text-yellow-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-gray-500">2 this week</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Folder className="text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">58</p>
            <p className="text-sm text-gray-500">5 new</p>
          </CardContent>
        </Card>
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
