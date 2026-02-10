"use client";

import { Loading } from "@/components/ui/loading";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ClientsPage() {
  const t = useTranslations();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllClients().then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Loading text={t("clients.loadingClients")} size="md" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center p-2 border-b-2 border-gray-300 pb-4 w-full mb-6">
        <h1 className="text-2xl cursor-default">{t("clients.title")}</h1>
        <Button
          className="cursor-pointer bg-gray-900 hover:bg-gray-800"
          onClick={() => router.push("/dashboard/clients/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("clients.addClient")}
        </Button>
      </div>
      {clients.length === 0 ? (
        <p>{t("clients.noClientsFound")}</p>
      ) : (
        <div className=" flex flex-col">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-3 py-5 border-b shadow-sm border-gray-400 rounded-lg flex justify-between items-center hover:bg-gray-300 hover:rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm">
                  <strong>{t("clients.name")}:</strong> {client.attributes.name}
                </p>
                <p className="text-sm">
                  <strong>{t("clients.email")}:</strong>{" "}
                  {client.attributes.email || t("common.na")}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  client.attributes.active === true
                    ? "bg-green-100 text-green-800"
                    : client.attributes.active === false
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {client.attributes.active === true
                  ? t("clients.active")
                  : client.attributes.active === false
                    ? t("clients.completed")
                    : t("clients.archived")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
