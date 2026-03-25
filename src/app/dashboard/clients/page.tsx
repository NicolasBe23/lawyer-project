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
import { ClientListItem } from "@/components/client/ClientListItem";

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
    <div className="mb-4">
      <div className="mb-6 flex w-full flex-col gap-3 border-b-2 border-gray-300 p-2 pb-4 md:flex-row md:items-center md:justify-between">
        <SplitText
          text={t("clients.title")}
          tag="h1"
          splitType="words"
          delay={30}
          duration={0.7}
          ease="power2.out"
          textAlign="center"
          className="text-2xl"
        />
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <ListSearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setVisibleCount(DEFAULT_SHOW_MORE_PAGE_SIZE);
            }}
            placeholder={t("clients.searchByName")}
          />
          <ListFilterDropdown
            value={clientFilter}
            options={clientFilterOptions}
            onChange={(value) => {
              setClientFilter(value);
              setVisibleCount(DEFAULT_SHOW_MORE_PAGE_SIZE);
            }}
          />

          <Button
            className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 md:w-auto"
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
        <div className="flex flex-col gap-3">
          {visibleClients.map((client, index) => (
            <ClientListItem
              key={client.id}
              client={client}
              index={index}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            />
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
