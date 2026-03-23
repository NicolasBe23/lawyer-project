"use client";

import { useCallback, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { navigationLinks } from "@/components/constants/page";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function Sidebar() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogoutClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const handleLogoutCancel = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  const handleNavigate = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const sidebarContent = (
    <>
      <div className="mb-8 mt-4 inline-flex items-center justify-center pr-3">
        <Image
          src="/logo_sidebar.png"
          alt="Law Management"
          width={160}
          height={40}
          priority
          className="h-14 w-auto object-contain cursor-default"
        />
        <div className="flex cursor-default flex-col justify-center text-xm font-bold text-amber-200">
          <h2>Law</h2>
          <h2>Management</h2>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {navigationLinks.map((link) => {
          const IconComponent = link.icon;
          const isActive = isActiveLink(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                isActive
                  ? "bg-gray-800 text-white font-medium"
                  : "text-gray-100 hover:bg-gray-800"
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
        className="mt-auto mb-2 flex cursor-pointer items-center gap-2 rounded-lg"
      >
        <LogOut size={20} /> {t("sidebar.logout")}
      </Button>
    </>
  );

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white p-3 md:hidden">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </Button>
          <div className="inline-flex items-center">
            <Image
              src="/logo_sidebar.png"
              alt="Law Management"
              width={110}
              height={30}
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="w-10" />
        </div>
      </div>

      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-gray-900 p-4 text-white md:flex">
        {sidebarContent}
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] border-r-0 bg-gray-900 p-4 text-white">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex h-full flex-col">{sidebarContent}</div>
        </SheetContent>
      </Sheet>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
