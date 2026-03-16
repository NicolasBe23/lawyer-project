"use client";

import { Loading } from "@/components/ui/loading";
import { Client, ClientFilter, ListFilterOption } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import SplitText from "@/components/ui/SplitText";
import { ShowMorePagination } from "@/components/ui/ShowMorePagination";
import {
  CLIENT_FILTER_OPTIONS,
  DEFAULT_SHOW_MORE_PAGE_SIZE,
} from "@/components/constants/page";
import { ListFilterDropdown } from "@/components/ui/ListFilterDropdown";
import { ListSearchInput } from "@/components/ui/ListSearchInput";

export default function ClientsPage() {
  const t = useTranslations();
  const [clients, setClients] = useState<Client[]>([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_SHOW_MORE_PAGE_SIZE);
  const [clientFilter, setClientFilter] = useState<ClientFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  useEffect(() => {
    getAllClients().then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  }, []);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) => {
        const matchesSearch =
          normalizedSearchTerm.length === 0 ||
          client.attributes.name.toLowerCase().includes(normalizedSearchTerm);
        if (!matchesSearch) return false;

        if (clientFilter === "all") return true;
        if (clientFilter === "active") return client.attributes.active === true;
        return client.attributes.active === false;
      }),
    [clients, clientFilter, normalizedSearchTerm],
  );

  const visibleClients = useMemo(
    () => filteredClients.slice(0, visibleCount),
    [filteredClients, visibleCount],
  );

  const filteredClientsCount = filteredClients.length;
  const hasMoreClients = visibleCount < filteredClientsCount;

  const clientFilterOptions: ListFilterOption<ClientFilter>[] =
    CLIENT_FILTER_OPTIONS.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
    }));

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
        <SplitText
          text={t("clients.title")}
          tag="h1"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="left"
          className="text-2xl"
        />
        <ListSearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setVisibleCount(DEFAULT_SHOW_MORE_PAGE_SIZE);
          }}
          placeholder={t("clients.searchByName")}
        />
        <div className="flex items-center gap-2">
          <ListFilterDropdown
            value={clientFilter}
            options={clientFilterOptions}
            onChange={(value) => {
              setClientFilter(value);
              setVisibleCount(DEFAULT_SHOW_MORE_PAGE_SIZE);
            }}
          />

          <Button
            className="cursor-pointer bg-gray-900 hover:bg-gray-800"
            onClick={() => router.push("/dashboard/clients/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("clients.addClient")}
          </Button>
        </div>
      </div>
      {filteredClientsCount === 0 ? (
        <p>{t("clients.noClientsFound")}</p>
      ) : (
        <div className=" flex flex-col gap-3">
          {visibleClients.map((client) => (
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

          <ShowMorePagination
            hasMore={hasMoreClients}
            onShowMore={() =>
              setVisibleCount((prev) =>
                Math.min(
                  prev + DEFAULT_SHOW_MORE_PAGE_SIZE,
                  filteredClientsCount,
                ),
              )
            }
          />
        </div>
      )}
    </div>
  );
}
