"use client";

import { useEffect, useState } from "react";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const RecentClientsCard = () => {
  const t = useTranslations();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClients().then((res) => {
      const sortedClients = res.data
        .filter((client) => client && client.attributes)
        .sort(
          (a, b) =>
            new Date(b.attributes.createdAt).getTime() -
            new Date(a.attributes.createdAt).getTime(),
        )
        .slice(0, 3);
      setClients(sortedClients);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-900 border border-white/10 shadow rounded-lg p-4">
      <h2 className="text-base font-semibold text-white mb-3">
        {t("dashboard.lastClients")}
      </h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.loadingClients")}</p>
      ) : clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.noClientFound")}</p>
      ) : (
        <Link href="/dashboard/clients">
          <ul className="space-y-2 text-sm">
            {clients.map((client) => (
              <li
                key={client.id}
                className="p-2 rounded-md border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-gray-200"
              >
                <span className="font-medium">{client.attributes.name}</span>
                <span className="text-muted-foreground">
                  {" "}— {client.attributes.email || t("clients.noEmail")}
                </span>
              </li>
            ))}
          </ul>
        </Link>
      )}
    </div>
  );
};
