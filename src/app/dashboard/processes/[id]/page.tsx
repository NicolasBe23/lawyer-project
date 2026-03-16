"use client";

import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { ProcessStatusBadge } from "@/components/process/ProcessStatusBadge";
import { ProcessClientInfo } from "@/components/process/ProcessClientInfo";
import { ProcessDates } from "@/components/process/ProcessDates";
import { ProcessDocuments } from "@/components/process/ProcessDocuments";
import { ProcessSchedules } from "@/components/process/ProcessSchedules";
import { ProcessStatusChanger } from "@/components/process/ProcessStatusChanger";
import { EditProcessModal } from "@/components/process/EditProcessModal";
import { useProcessDetailsPage } from "@/lib/useProcessDetailsPage";

export default function ProcessPage() {
  const {
    process,
    loading,
    error,
    showEditModal,
    saving,
    setShowEditModal,
    handleStatusChange,
    handleEditProcess,
    goBackToProcesses,
    formatDate,
    t,
  } = useProcessDetailsPage();

  if (loading) {
    return (
      <div className="p-6">
        <Loading text={t("processes.loadingProcess")} size="md" />
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="container mx-auto p-2">
        <Button variant="outline" onClick={goBackToProcesses} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
        <p className="text-red-600">
          {error || t("processes.processNotFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goBackToProcesses}
          className="cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>

        <div className="flex items-center space-x-2">
          <ProcessStatusChanger
            processId={String(process.id)}
            currentStatus={process.processStatus}
            onStatusChange={handleStatusChange}
          />

          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setShowEditModal(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            {t("common.edit")}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">{process.title}</h1>
          <p className="text-muted-foreground">
            {t("processes.process")}: Nº {process.processNumber}
          </p>
        </div>
        <ProcessStatusBadge status={process.processStatus} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ProcessClientInfo client={process.client} />
        <ProcessDates
          startDate={process.startDate}
          completionDate={process.completionDate}
          formatDate={formatDate}
        />
      </div>

      {process.description && (
        <Card>
          <CardHeader>
            <CardTitle>{t("common.description")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-muted-foreground">
              {process.description}
            </div>
          </CardContent>
        </Card>
      )}

      <ProcessDocuments
        processId={String(process.id)}
        documents={process.process_documents}
        formatDate={formatDate}
      />

      <ProcessSchedules schedules={process.schedules} />

      <EditProcessModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        process={process}
        onSave={handleEditProcess}
        isLoading={saving}
      />
    </div>
  );
}
