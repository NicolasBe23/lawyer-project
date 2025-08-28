import { useState, useEffect } from "react";
import {
  Client,
  Process,
  Document,
  Schedule,
  DashboardStats,
  StrapiResponse,
} from "@/types/types";
import {
  clientService,
  processService,
  documentService,
  scheduleService,
} from "@/lib/strapi";

export const useGetDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [clientsRes, processesRes, documentsRes, schedulesRes] =
          await Promise.all([
            clientService.getAll(),
            processService.getAll(),
            documentService.getAll(),
            scheduleService.getAll(),
          ]);

        const clients = (clientsRes.data as StrapiResponse<Client>).data;
        const processes = (processesRes.data as StrapiResponse<Process>).data;
        const documents = (documentsRes.data as StrapiResponse<Document>).data;
        const schedules = (schedulesRes.data as StrapiResponse<Schedule>).data;

        const activeProcesses = processes.filter((p: Process) => {
          return p.processStatus === "active";
        });

        setStats({
          clients: clients.length,
          processes: processes.length,
          documents: documents.length,
          schedules: schedules.length,

          clientsThisMonth: clients.filter(
            (c: Client) =>
              new Date(c.attributes.createdAt).getMonth() ===
                new Date().getMonth() &&
              new Date(c.attributes.createdAt).getFullYear() ===
                new Date().getFullYear()
          ).length,

          activeProcesses: activeProcesses.length,

          schedulesThisWeek: schedules.filter((s: Schedule) => {
            const date = new Date();
            const today = new Date();
            const weekFromNow = new Date();
            weekFromNow.setDate(today.getDate() + 7);
            return date >= today && date < weekFromNow;
          }).length,

          newDocuments: documents.filter(
            () => new Date() > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
        });

        setClientsData(clients);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, clientsData, loading };
};
