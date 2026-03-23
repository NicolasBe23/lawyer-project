"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/client-detail/ClientForm";
import { useAddClientPage } from "@/lib/useAddClientPage";

export default function AddClientPage() {
  const { t, isLoading, handleCreateClient, goBackToClients } =
    useAddClientPage();

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          className="mb-4 w-full cursor-pointer sm:w-auto"
          onClick={goBackToClients}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>
      <h1 className="cursor-default text-2xl font-bold sm:text-3xl">
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
            onCancel={goBackToClients}
          />
        </CardContent>
      </Card>
    </div>
  );
}
