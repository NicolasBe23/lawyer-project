"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Client } from "@/types/types";
import { createClient } from "@/lib/helpers/clientHelpers";

export const useAddClientPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateClient = async (
    clientData: Partial<Client["attributes"]>
  ) => {
    try {
      setIsLoading(true);
      const newClient = await createClient(clientData);
      if (newClient) {
        toast.success(t("clients.clientCreatedSuccessfully"));
        router.push(`/dashboard/clients/${newClient.id}`);
      }
    } catch {
      toast.error(t("clients.errorCreatingClient"));
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToClients = () => {
    router.push("/dashboard/clients");
  };

  return {
    isLoading,
    handleCreateClient,
    goBackToClients,
    t,
  };
};
