"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { StrapiError } from "@/types/types";
import { useTranslations } from "next-intl";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = (err as StrapiError).response?.data?.error?.message;

      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError(t("register.errorCreatingAccount"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormCard
      title={t("register.title")}
      description={t("register.description")}
      footerText={t("register.alreadyHaveAccount")}
      footerLinkText={t("register.login")}
      footerLinkHref="/login"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input
          type="text"
          placeholder={t("register.username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />

        <Input
          type="email"
          placeholder={t("register.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder={t("register.password")}
          required
          disabled={loading}
        />

        <AuthSubmitButton
          loading={loading}
          loadingText={t("register.creatingAccount")}
          submitText={t("register.register")}
        />
      </form>
    </AuthFormCard>
  );
}
