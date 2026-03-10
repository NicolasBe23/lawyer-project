"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/ui/loading";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { createProcess } from "@/services/createProcess";

export default function AddProcessPage() {
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

  useEffect(() => {
    const loadClients = async () => {
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
    };

    loadClients();
  }, []);

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

  if (loadingClients) {
    return (
      <div className="p-6">
        <Loading text={t("clients.loadingClients")} size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          className="cursor-pointer mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>

      <h1 className="text-3xl font-bold cursor-default">{t("processes.newProcess")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("processes.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processNumber">{t("processes.process")} *</Label>
                <Input
                  id="processNumber"
                  value={formData.processNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      processNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">{t("processes.startDate")} *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titulo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">{t("clients.title")} *</Label>
              <select
                id="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client: e.target.value }))
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.attributes.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("common.description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("common.loading") : t("common.save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
