"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
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
      await axios.post("/api/auth/login", { identifier, password });

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
