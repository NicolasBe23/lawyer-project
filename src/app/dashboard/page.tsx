"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/types/types";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Here you can manage clients, processes and your profile.
      </p>
    </div>
  );
}
