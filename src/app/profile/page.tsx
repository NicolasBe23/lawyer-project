"use client";

import { useUser } from "@/lib/useUser";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { strapiApi } from "@/lib/strapi";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations();
  const { user, loading } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      const response = await strapiApi.put(`/users/${user.id}`, {
        username: username.trim(),
        email: email.trim(),
        ...(password.trim() ? { password: password.trim() } : {}),
      });

      const updatedUser = response.data;
      Cookies.set("strapi_user", JSON.stringify(updatedUser), { expires: 7 });
      setMessage(t("profile.updateSuccess"));
      setPassword("");
    } catch {
      setMessage(t("profile.updateError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text={t("common.loading")} size="md" />;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-lg bg-white p-4 shadow sm:p-8 md:p-12">
      <div>
        <Button
          variant="outline"
          className="w-full cursor-pointer sm:w-auto"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft size={20} /> {t("profile.backToDashboard")}
        </Button>
      </div>
      <h1 className="text-2xl mb-4 cursor-default">{t("profile.title")}</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">{t("profile.name")}</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">{t("profile.email")}</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm">
            {t("profile.newPasswordOptional")}
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 sm:w-auto"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loading text={t("profile.saving")} size="md" />
          ) : (
            t("profile.saveChanges")
          )}
        </Button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
}
