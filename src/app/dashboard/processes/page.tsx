"use client";

import { Loading } from "@/components/ui/loading";
import { Process } from "@/types/types";
import { getAllProcesses } from "@/services/getAllProcesses";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Briefcase } from "lucide-react";
import { ProcessStatusBadge } from "@/components/process/ProcessStatusBadge";
import { useTranslations } from "next-intl";
import SplitText from "@/components/ui/SplitText";

export default function ProcessesPage() {
  const t = useTranslations();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllProcesses().then((res) => {
      setProcesses(res.data);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading text={t("processes.loadingProcesses")} size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center p-2 border-b-2 border-gray-300 pb-4 w-full mb-6">
        <SplitText
          text={t("processes.myProcesses")}
          tag="h1"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="left"
          className="text-2xl"
        />

        <Button
          className="cursor-pointer bg-gray-900 hover:bg-gray-800"
          onClick={() => router.push("/dashboard/processes/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("processes.newProcess")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>
              {t("processes.allProcesses")} ({processes.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("processes.noProcessesFound")}
            </p>
          ) : (
            <div className="space-y-4">
              {processes.map((process) => (
                <div
                  key={process.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{process.title}</h4>
                      <ProcessStatusBadge status={process.processStatus} />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        {t("processes.process")}: {process.processNumber}
                      </p>
                      <p>
                        {t("clients.name")}:{" "}
                        {process.client?.name || t("common.na")}
                      </p>
                      <p>
                        {t("processes.start")}: {formatDate(process.startDate)}
                      </p>
                      {process.completionDate && (
                        <p>
                          {t("processes.completed")}:{" "}
                          {formatDate(process.completionDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 cursor-pointer"
                    onClick={() => {
                      const processIdentifier =
                        process.documentId || process.id;
                      router.push(`/dashboard/processes/${processIdentifier}`);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t("processes.viewDetails")}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
