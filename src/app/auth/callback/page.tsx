"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { AuthResponse } from "@/types/types";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = searchParams.get("access_token");

      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get<AuthResponse>(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/google/callback?access_token=${accessToken}`
        );

        localStorage.setItem("strapi_token", res.data.jwt);

        router.push("/dashboard");
      } catch (error) {
        console.error("Erro no callback:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Loading, wait...</p>
    </div>
  );
}
