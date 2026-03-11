"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { AuthResponse } from "@/types/types";
import { useTranslations } from "next-intl";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";

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
    <AuthFormCard
      title={t("login.title")}
      description={t("login.description")}
      footerText={t("login.dontHaveAccount")}
      footerLinkText={t("login.register")}
      footerLinkHref="/register"
    >
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

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder={t("login.password")}
          required
          disabled={loading}
        />

        <AuthSubmitButton
          loading={loading}
          loadingText={t("login.signingIn")}
          submitText={t("login.login")}
        />
      </form>
    </AuthFormCard>
  );
}
