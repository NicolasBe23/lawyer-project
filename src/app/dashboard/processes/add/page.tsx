"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/ui/loading";
import { useAddProcessPage } from "@/lib/useAddProcessPage";

export default function AddProcessPage() {
  const t = useTranslations();
  const {
    clients,
    loadingClients,
    isSubmitting,
    formData,
    setFormData,
    handleSubmit,
    handleBack,
  } = useAddProcessPage();

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
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>

      <h1 className="cursor-default text-2xl font-bold sm:text-3xl">
        {t("processes.newProcess")}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("processes.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="processNumber">
                  {t("processes.process")} *
                </Label>
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
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
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

            <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full cursor-pointer sm:w-auto"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 sm:w-auto"
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
