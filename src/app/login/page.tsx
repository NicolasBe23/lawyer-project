"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthResponse } from "@/types/types";
import { Loading } from "@/components/ui/loading";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginPromise = axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local`,
        { identifier, password },
      );

      const delayPromise = new Promise((resolve) => setTimeout(resolve, 1500));

      const [res] = await Promise.all([loginPromise, delayPromise]);

      Cookies.set("strapi_token", res.data.jwt, { expires: 7 });
      Cookies.set("strapi_user", JSON.stringify(res.data.user), { expires: 7 });

      router.push("/dashboard");
    } catch {
      setError(t("login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">{t("login.title")}</CardTitle>
          <CardDescription className="text-center">
            {t("login.description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Input
              type="text"
              placeholder={t("login.emailOrUsername")}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="password"
              placeholder={t("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? (
                <Loading text={t("login.signingIn")} size="md" />
              ) : (
                t("login.login")
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-center flex flex-col gap-4">
          <p>
            {t("login.dontHaveAccount")}{" "}
            <a href="/register" className="text-blue-700 hover:underline">
              {t("login.register")}
            </a>
          </p>
          <div className="flex justify-center mt-4">
            <LanguageSwitcher />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
