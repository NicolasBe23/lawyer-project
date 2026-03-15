import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { User } from "@/types/types";

const API_URL =
  process.env.STRAPI_API_URL ||
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "http://localhost:1337";

const getAuthenticatedUser = async (token: string): Promise<User | null> => {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as User;
  } catch {
    return null;
  }
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("strapi_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await getAuthenticatedUser(token);
  if (!user) {
    redirect("/login");
  }

  return <DashboardContent user={user} />;
}
