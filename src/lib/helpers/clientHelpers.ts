import { Client, Process, Schedule } from "@/types/types";
import {
  clientService,
  processService,
  scheduleService,
  strapiApi,
} from "@/lib/strapi";

export const fetchClientData = async (clientId: string) => {
  const clientResponse = await clientService.getById(clientId);
  const clientData = clientResponse.data.data;

  const processesResponse = await processService.getAll();
  const allProcesses = processesResponse.data.data || [];
  const clientProcesses = allProcesses.filter(
    (process: Process) => process.client && process.client.id === clientData.id
  );

  const schedulesResponse = await scheduleService.getAll();
  const allSchedules = schedulesResponse.data.data || [];
  const clientSchedules = allSchedules.filter(
    (schedule: Schedule) => schedule.client?.id === clientData.id
  );

  return {
    client: clientData,
    processes: clientProcesses,
    schedules: clientSchedules,
  };
};

export const deleteClient = async (clientId: string) => {
  await clientService.delete(clientId);
};

export const updateClient = async (
  clientId: string,
  clientData: Partial<Client["attributes"]>
) => {
  const dataToSend = Object.entries(clientData).reduce((acc, [key, value]) => {
    if (key === "active" && typeof value === "boolean") {
      acc[key] = value;
    } else if (typeof value === "string" && value.trim()) {
      acc[key] = value.trim();
    }
    return acc;
  }, {} as Record<string, string | boolean>);

  const response = await strapiApi.put(`/clients/${clientId}`, {
    data: dataToSend,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return null;
};

export const createClient = async (
  clientData: Partial<Client["attributes"]>
) => {
  const dataToSend = Object.entries(clientData).reduce((acc, [key, value]) => {
    if (key === "active" && typeof value === "boolean") {
      acc[key] = value;
    } else if (typeof value === "string" && value.trim()) {
      acc[key] = value.trim();
    }
    return acc;
  }, {} as Record<string, string | boolean>);

  const response = await strapiApi.post("/clients", {
    data: dataToSend,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return null;
};
