"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("strapi_token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {token ? (
          <p className="mt-4 text-gray-700">
            You are logged in with the token: <br />
            <span className="text-xs break-all">{token}</span>
          </p>
        ) : (
          <p>Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}
