"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Process } from "@/types/types";
import { getProcessById } from "@/services/getProcessById";
import { updateProcessDetails } from "@/services/updateProcess";

export const useProcessDetailsPage = () => {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const processId = params.id as string;

  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProcess = useCallback(async () => {
    if (!processId) return;

    setLoading(true);
    const res = await getProcessById(processId);
    if (res.error) {
      setError(res.error);
    } else {
      setError(null);
      setProcess(res.data);
    }
    setLoading(false);
  }, [processId]);

  useEffect(() => {
    loadProcess();
  }, [loadProcess]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleStatusChange = (newStatus: string) => {
    if (!process) return;
    setProcess({
      ...process,
      processStatus: newStatus as "active" | "completed" | "archived",
    });
  };

  const handleEditProcess = async (data: {
    processNumber: string;
    title: string;
    description?: string;
    startDate: string;
    completionDate?: string;
  }) => {
    if (!process) return;

    setSaving(true);
    try {
      const { data: updatedProcess, error } = await updateProcessDetails(
        String(process.id),
        data
      );

      if (error || !updatedProcess) {
        toast.error(error || t("processes.failedToUpdateProcess"));
        return;
      }

      toast.success(t("processes.processUpdatedSuccessfully"));
      setShowEditModal(false);
      setProcess(updatedProcess);
    } catch {
      toast.error(t("processes.failedToUpdateProcess"));
    } finally {
      setSaving(false);
    }
  };

  const goBackToProcesses = () => {
    router.push("/dashboard/processes");
  };

  return {
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
  };
};
