"use client";

import { Loading } from "@/components/ui/loading";
import { Process } from "@/types/types";
import { getProcessById } from "@/services/getProcessById";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ProcessStatusBadge } from "@/components/process/ProcessStatusBadge";
import { ProcessClientInfo } from "@/components/process/ProcessClientInfo";
import { ProcessDates } from "@/components/process/ProcessDates";
import { ProcessDocuments } from "@/components/process/ProcessDocuments";
import { ProcessSchedules } from "@/components/process/ProcessSchedules";
import { ProcessStatusChanger } from "@/components/process/ProcessStatusChanger";
import { useTranslations } from "next-intl";

export default function ProcessPage() {
  const t = useTranslations();
  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const processId = params.id as string;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    if (processId) {
      getProcessById(processId).then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setProcess(res.data);
        }
        setLoading(false);
      });
    }
  }, [processId]);

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
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/processes")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
        <p className="text-red-600">{error || t("processes.processNotFound")}</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    if (process) {
      setProcess({
        ...process,
        processStatus: newStatus as "active" | "completed" | "archived",
      });
    }
  };

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/processes")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>

        <ProcessStatusChanger
          processId={processId}
          currentStatus={process.processStatus}
          onStatusChange={handleStatusChange}
        />
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
          createdAt={process.createdAt}
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
        processId={processId}
        documents={process.process_documents}
        formatDate={formatDate}
      />

      <ProcessSchedules schedules={process.schedules} />
    </div>
  );
}
