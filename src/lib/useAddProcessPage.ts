"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { createProcess } from "@/services/createProcess";

const API_URL = "/api/strapi";

type ProcessIdentifierCandidate = {
  id?: number | string;
  documentId?: string;
  attributes?: {
    documentId?: string;
  };
};

const extractProcessIdentifier = (
  processData: ProcessIdentifierCandidate | null | undefined
) => {
  if (!processData) return null;
  if (processData.documentId) return processData.documentId;
  if (processData.attributes?.documentId) return processData.attributes.documentId;
  if (typeof processData.id !== "undefined") return String(processData.id);
  return null;
};

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

    const createdProcess = data as ProcessIdentifierCandidate;
    let processIdentifier = extractProcessIdentifier(createdProcess);

    // Fallback: refetch latest created process with the same number.
    // Some Strapi response shapes can omit `documentId` in the create payload.
    if (!processIdentifier) {
      try {
        const res = await fetch(
          `${API_URL}/processes?filters[processNumber][$eq]=${encodeURIComponent(
            formData.processNumber.trim()
          )}&sort[0]=createdAt:desc&pagination[pageSize]=1`
        );

        if (res.ok) {
          const responseData = await res.json();
          const latestMatch = responseData?.data?.[0] as ProcessIdentifierCandidate;
          processIdentifier = extractProcessIdentifier(latestMatch);
        }
      } catch {
        // Ignore fallback error and let final guard handle navigation failure.
      }
    }

    if (!processIdentifier) {
      toast.success(t("processes.processCreatedSuccessfully"));
      router.push("/dashboard/processes");
      return;
    }

    toast.success(t("processes.processCreatedSuccessfully"));
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
