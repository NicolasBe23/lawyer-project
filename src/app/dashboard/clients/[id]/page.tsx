"use client";

import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ArrowLeft } from "lucide-react";
import {
  ClientHeader,
  ClientBasicInfo,
  ClientProcesses,
  ClientSummary,
  ClientSchedules,
  DeleteClientModal,
  EditClientModal,
} from "@/components/client-detail";
import { formatDate, formatDateTime } from "@/lib/helpers/dateHelpers";
import { useClientDetailsPage } from "@/lib/useClientDetailsPage";

export default function ClientPage() {
  const {
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
  } = useClientDetailsPage();

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
        <Button onClick={goBackToClients}>
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
        onBack={goBackToClients}
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
