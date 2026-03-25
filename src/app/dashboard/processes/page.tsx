"use client";

import { Loading } from "@/components/ui/loading";
import { ListFilterOption, Process, ProcessFilter } from "@/types/types";
import { getAllProcesses } from "@/services/getAllProcesses";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import SplitText from "@/components/ui/SplitText";
import { ShowMorePagination } from "@/components/ui/ShowMorePagination";
import {
  DEFAULT_SHOW_MORE_PAGE_SIZE,
  PROCESS_FILTER_OPTIONS,
} from "@/components/constants/page";
import { ListFilterDropdown } from "@/components/ui/ListFilterDropdown";
import { ListSearchInput } from "@/components/ui/ListSearchInput";
import { ProcessListItem } from "@/components/process/ProcessListItem";

export default function ProcessesPage() {
  const t = useTranslations();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_SHOW_MORE_PAGE_SIZE);
  const [processFilter, setProcessFilter] = useState<ProcessFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  useEffect(() => {
    getAllProcesses().then((res) => {
      setProcesses(res.data);
      setLoading(false);
    });
  }, []);

  const filteredProcesses = useMemo(
    () =>
      processes.filter((process) => {
        const matchesSearch =
          normalizedSearchTerm.length === 0 ||
          process.title.toLowerCase().includes(normalizedSearchTerm) ||
          process.processNumber.toLowerCase().includes(normalizedSearchTerm);
        if (!matchesSearch) return false;

        if (processFilter === "all") return true;
        return process.processStatus === processFilter;
      }),
    [processes, processFilter, normalizedSearchTerm],
  );

  const visibleProcesses = useMemo(
    () => filteredProcesses.slice(0, visibleCount),
    [filteredProcesses, visibleCount],
  );

  const filteredProcessesCount = filteredProcesses.length;
  const hasMoreProcesses = visibleCount < filteredProcessesCount;

  const processFilterOptions: ListFilterOption<ProcessFilter>[] =
    PROCESS_FILTER_OPTIONS.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
    }));

  if (loading) {
    return (
      <div className="p-6">
        <Loading text={t("processes.loadingProcesses")} size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-4">
      <div className="mb-6 flex w-full flex-col gap-3 border-b-2 border-gray-300 p-2 pb-4 md:flex-row md:items-center md:justify-between">
        <SplitText
          text={t("processes.myProcesses")}
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
            placeholder={t("processes.searchByNameOrNumber")}
          />
          <ListFilterDropdown
            value={processFilter}
            options={processFilterOptions}
            onChange={(value) => {
              setProcessFilter(value);
              setVisibleCount(DEFAULT_SHOW_MORE_PAGE_SIZE);
            }}
          />

          <Button
            className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 md:w-auto"
            onClick={() => router.push("/dashboard/processes/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("processes.newProcess")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>
              {t("processes.allProcesses")} ({filteredProcessesCount})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProcessesCount === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("processes.noProcessesFound")}
            </p>
          ) : (
            <div className="space-y-4">
              {visibleProcesses.map((process, index) => (
                <ProcessListItem
                  key={process.id}
                  process={process}
                  index={index}
                  onViewDetails={() => {
                    const processIdentifier = process.documentId || process.id;
                    router.push(`/dashboard/processes/${processIdentifier}`);
                  }}
                />
              ))}

              <ShowMorePagination
                hasMore={hasMoreProcesses}
                onShowMore={() =>
                  setVisibleCount((prev) =>
                    Math.min(
                      prev + DEFAULT_SHOW_MORE_PAGE_SIZE,
                      filteredProcessesCount,
                    ),
                  )
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
