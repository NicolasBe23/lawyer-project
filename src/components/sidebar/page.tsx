"use client";

import { Home, Calendar, FileText, LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Sidebar() {
  const { user, loading } = useUser();
  const router = useRouter();

  const navigationLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/clients", icon: Users, label: "Clients" },
    { href: "/dashboard/processes", icon: FileText, label: "Processes" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/dashboard/documents", icon: FileText, label: "Documents" },
    { href: "/dashboard/schedules", icon: Calendar, label: "Schedule" },
  ];

  const handleLogout = () => {
    Cookies.remove("strapi_token");
    Cookies.remove("strapi_user");
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6 mt-4">⚖️ Lawyer App</h2>

        <div className="mb-8">
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : user ? (
            <>
              <p className="font-medium">Lawyer: Mr. {user.username}</p>
            </>
          ) : (
            <p className="text-sm text-red-400">User not found</p>
          )}
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          {navigationLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800"
              >
                <IconComponent size={20} /> {link.label}
              </Link>
            );
          })}
        </nav>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2 mt-auto mb-2 cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </Button>
      </aside>
    </div>
  );
}
