"use client";

import { useCallback, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { navigationLinks } from "@/components/constants/page";

export default function Sidebar() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(async (): Promise<void> => {
    const logoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        Cookies.remove("strapi_token");
        Cookies.remove("strapi_user");
        resolve();
      }, 1000);
    });

    await logoutPromise;
    router.push("/login");
  }, [router]);

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
