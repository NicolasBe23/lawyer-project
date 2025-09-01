"use client";

import { useUser } from "@/lib/useUser";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";

export default function ProfilePage() {
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
      const token = Cookies.get("strapi_token");
      if (!token) throw new Error("Token not found");

      const res = await fetch(`http://localhost:1337/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          ...(password ? { password } : {}),
        }),
      });

      if (!res.ok) throw new Error("Error updating profile");

      const updatedUser = await res.json();
      Cookies.set("strapi_user", JSON.stringify(updatedUser), { expires: 7 });
      setMessage("Profile updated successfully!");
      setPassword("");
    } catch {
      setMessage("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mx-auto bg-white p-12 rounded-lg shadow w-full gap-8 flex flex-col">
      <div>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </Button>
      </div>
      <h1 className="text-2xl mb-4 cursor-default">My Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm">New Password (optional)</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="cursor-pointer bg-gray-900 hover:bg-gray-800"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loading text="Saving..." size="md" /> : "Save Changes"}
        </Button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
}
