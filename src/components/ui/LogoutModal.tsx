"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoutModalProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  const t = useTranslations();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirm();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border border-white/10 shadow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("logout.confirmLogout")}
          </DialogTitle>
          <DialogDescription>
            {t("logout.confirmLogoutDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="cursor-pointer bg-gray-900 border border-white/10 shadow text-amber-50 hover:bg-gray-700"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            disabled={isLoggingOut}
            className="cursor-pointer"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("logout.loggingOut")}
              </>
            ) : (
              <>{t("sidebar.logout")}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
