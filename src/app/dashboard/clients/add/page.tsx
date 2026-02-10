"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Client } from "@/types/types";
import { ClientForm } from "@/components/client-detail/ClientForm";
import { createClient } from "@/lib/helpers/clientHelpers";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AddClientPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateClient = async (
    clientData: Partial<Client["attributes"]>,
  ) => {
    try {
      setIsLoading(true);
      const newClient = await createClient(clientData);
      if (newClient) {
        router.push(`/dashboard/clients/${newClient.id}`);
      }
    } catch {
      toast.error(t("clients.errorCreatingClient"));
    } finally {
      setIsLoading(false);
    }
  };

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
      <h1 className="text-3xl font-bold cursor-default">
        {t("clients.addNewClient")}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("clients.clientInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmit={handleCreateClient}
            isLoading={isLoading}
            submitText={t("clients.createClient")}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
