"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { createProcess } from "@/services/createProcess";

export const useAddProcessPage = () => {
  const t = useTranslations();
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    processNumber: "",
    title: "",
    description: "",
    startDate: "",
    client: "",
  });

  const loadClients = useCallback(async () => {
    try {
      const { data, error } = await getAllClients();
      if (error) {
        toast.error(error);
        return;
      }
      setClients(data);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await createProcess({
      processNumber: formData.processNumber.trim(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      processStatus: "active",
      startDate: formData.startDate,
      client: formData.client ? Number(formData.client) : undefined,
    });

    setIsSubmitting(false);

    if (error || !data) {
      toast.error(t("processes.errorCreatingProcess"));
      return;
    }

    toast.success(t("processes.processCreatedSuccessfully"));
    const processIdentifier = data.documentId || data.id;
    router.push(`/dashboard/processes/${processIdentifier}`);
  };

  const handleBack = () => {
    router.push("/dashboard/processes");
  };

  return {
    clients,
    loadingClients,
    isSubmitting,
    formData,
    setFormData,
    handleSubmit,
    handleBack,
  };
};
