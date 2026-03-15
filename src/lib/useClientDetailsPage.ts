"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Client, Process, Schedule } from "@/types/types";
import {
  fetchClientData,
  deleteClient,
  updateClient,
} from "@/lib/helpers/clientHelpers";

export const useClientDetailsPage = () => {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadClientData = useCallback(async () => {
    if (!clientId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchClientData(clientId);
      setClient(data.client);
      setProcesses(data.processes);
      setSchedules(data.schedules);
    } catch {
      setError(t("clients.errorLoadingClientData"));
    } finally {
      setLoading(false);
    }
  }, [clientId, t]);

  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  const handleDeleteClient = async () => {
    if (!client) return;

    try {
      setActionLoading(true);
      await deleteClient(clientId);
      toast.success(t("clients.clientDeletedSuccessfully"));
      router.push("/dashboard/clients");
    } catch {
      toast.error(t("clients.errorDeletingClient"));
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditClient = async (clientData: Partial<Client["attributes"]>) => {
    if (!client) return;

    try {
      setActionLoading(true);
      const updatedClient = await updateClient(clientId, clientData);
      if (updatedClient) {
        setClient(updatedClient);
        toast.success(t("clients.clientUpdatedSuccessfully"));
        setShowEditModal(false);
      }
    } catch {
      toast.error(t("clients.errorUpdatingClient"));
    } finally {
      setActionLoading(false);
    }
  };

  const goBackToClients = () => {
    router.push("/dashboard/clients");
  };

  return {
    client,
    processes,
    schedules,
    loading,
    error,
    showDeleteModal,
    showEditModal,
    actionLoading,
    setShowDeleteModal,
    setShowEditModal,
    handleDeleteClient,
    handleEditClient,
    goBackToClients,
    t,
  };
};
