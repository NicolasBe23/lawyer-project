"use client";

import { useCallback, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { navigationLinks } from "@/components/constants/page";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
        <aside className="w-60 bg-gray-900 text-white flex flex-col p-4">
          <div className="mb-8 mt-4 inline-flex items-center justify-center mr-3">
            <Image
              src="/logo_sidebar.png"
              alt="Law Management"
              width={160}
              height={40}
              priority
              className="h-14 w-auto object-contain cursor-default"
            />
            <div className="flex flex-col justify-center text-amber-200 text-xm font-bold cursor-default">
              <h2>Law</h2>
              <h2>Management</h2>
            </div>
          </div>

          <nav className="flex flex-col gap-3 flex-1">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white font-medium"
                      : "hover:bg-gray-800 text-gray-100"
                  }`}
                >
                  <IconComponent size={20} /> {t(link.label)}
                </Link>
              );
            })}
          </nav>

          <Button
            onClick={handleLogoutClick}
            variant="destructive"
            className="flex items-center gap-2 mt-auto mb-2 cursor-pointer rounded-lg"
          >
            <LogOut size={20} /> {t("sidebar.logout")}
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
