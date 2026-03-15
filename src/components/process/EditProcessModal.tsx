"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditProcessModalProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const EditProcessModal = ({
  isOpen,
  onClose,
  process,
  onSave,
  isLoading = false,
}: EditProcessModalProps) => {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    processNumber: "",
    title: "",
    description: "",
    startDate: "",
    completionDate: "",
  });

  useEffect(() => {
    if (!process) return;

    setFormData({
      processNumber: process.processNumber || "",
      title: process.title || "",
      description: process.description || "",
      startDate: process.startDate ? process.startDate.split("T")[0] : "",
      completionDate: process.completionDate
        ? process.completionDate.split("T")[0]
        : "",
    });
  }, [process]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      processNumber: formData.processNumber.trim(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate: formData.startDate,
      completionDate: formData.completionDate || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("common.edit")} {t("processes.process").toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-process-number">
              {t("processes.process")} *
            </Label>
            <Input
              id="edit-process-number"
              value={formData.processNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  processNumber: e.target.value,
                }))
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-process-title">
              {t("documents.titleField")} *
            </Label>
            <Input
              id="edit-process-title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-process-description">
              {t("common.description")}
            </Label>
            <Textarea
              id="edit-process-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-process-start-date">
                {t("processes.startDate")} *
              </Label>
              <Input
                id="edit-process-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? t("common.loading") : t("clients.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
