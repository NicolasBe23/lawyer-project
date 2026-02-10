"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ArrowLeft } from "lucide-react";
import { Client, Process, Schedule } from "@/types/types";
import {
  ClientHeader,
  ClientBasicInfo,
  ClientProcesses,
  ClientSummary,
  ClientSchedules,
  DeleteClientModal,
  EditClientModal,
} from "@/components/client-detail";
import { toast } from "sonner";
import {
  fetchClientData,
  deleteClient,
  updateClient,
} from "@/lib/helpers/clientHelpers";
import { formatDate, formatDateTime } from "@/lib/helpers/dateHelpers";
import { useTranslations } from "next-intl";
export default function ClientPage() {
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

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const data = await fetchClientData(clientId);
      setClient(data.client);
      setProcesses(data.processes);
      setSchedules(data.schedules);
    } catch {
      setError(t("clients.errorLoadingClientData"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!client) return;

    try {
      setActionLoading(true);
      await deleteClient(clientId);
      router.push("/dashboard/clients");
    } catch {
      toast.error(t("clients.errorDeletingClient"));
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditClient = async (
    clientData: Partial<Client["attributes"]>,
  ) => {
    if (!client) return;

    try {
      setActionLoading(true);
      const updatedClient = await updateClient(clientId, clientData);
      if (updatedClient) {
        setClient(updatedClient);
        setShowEditModal(false);
      }
    } catch {
      toast.error(t("clients.errorUpdatingClient"));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">
          {error || t("clients.clientNotFound")}
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <ClientHeader
        client={client}
        onBack={() => router.back()}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteModal(true)}
        formatDate={formatDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClientBasicInfo client={client} formatDate={formatDate} />
          <ClientProcesses processes={processes} formatDate={formatDate} />
        </div>

        <div className="space-y-6">
          <ClientSummary
            client={client}
            processes={processes}
            schedules={schedules}
            formatDate={formatDate}
          />
          <ClientSchedules
            schedules={schedules}
            formatDateTime={formatDateTime}
          />
        </div>
      </div>

      <DeleteClientModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteClient}
        clientName={client.attributes.name}
        isLoading={actionLoading}
      />

      <EditClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditClient}
        client={client}
        isLoading={actionLoading}
      />
    </div>
  );
}
