"use client";

import { useCallback, useState } from "react";
import { Home, Calendar, FileText, LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Sidebar() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigationLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/clients", icon: Users, label: "Clients" },
    { href: "/dashboard/processes", icon: FileText, label: "Processes" },
    { href: "/dashboard/documents", icon: FileText, label: "Documents" },
    { href: "/dashboard/schedules", icon: Calendar, label: "Schedule" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogoutClick = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const handleLogoutConfirm = async (): Promise<void> => {
    const logoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        Cookies.remove("strapi_token");
        Cookies.remove("strapi_user");
        resolve();
      }, 1000);
    });

    await logoutPromise;
    router.push("/login");
  };

  const handleLogoutCancel = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  return (
    <>
      <div className="flex h-screen">
        <aside className="w-50 bg-gray-900 text-white flex flex-col p-4">
          <h2 className="text-xl font-bold mb-8 mt-4 cursor-default">
            ⚖️ Lawyer App
          </h2>

          <nav className="flex flex-col gap-3 flex-1">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                >
                  <IconComponent size={20} /> {link.label}
                </Link>
              );
            })}
          </nav>

          <Button
            onClick={handleLogoutClick}
            variant="destructive"
            className="flex items-center gap-2 mt-auto mb-2 cursor-pointer rounded-lg"
          >
            <LogOut size={20} /> Logout
          </Button>
        </aside>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
