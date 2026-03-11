import axios from "axios";
import {
  Client,
  DocumentData,
  Process,
  Schedule,
  StrapiResponse,
  StrapiSingleResponse,
} from "../types/types";

export const strapiApi = axios.create({
  baseURL: "/api/strapi",
  headers: {
    "Content-Type": "application/json",
  },
});

export const clientService = {
  getAll: () => strapiApi.get<StrapiResponse<Client>>("/clients"),
  getById: (id: string) =>
    strapiApi.get<StrapiSingleResponse<Client>>(`/clients/${id}?populate=*`),
  create: (data: Client) => strapiApi.post("/clients", { data }),
  update: (id: string, data: Client) =>
    strapiApi.put(`/clients/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/clients/${id}`),
};

export const processService = {
  getAll: () => strapiApi.get<StrapiResponse<Process>>("/processes?populate=*"),
  getById: (id: string) =>
    strapiApi.get<StrapiSingleResponse<Process>>(`/processes/${id}?populate=*`),
  getByDocumentId: (documentId: string) =>
    strapiApi.get<StrapiResponse<Process>>(
      `/processes?filters[documentId][$eq]=${documentId}&populate=*`
    ),
  getByClient: (clientId: string) =>
    strapiApi.get<StrapiResponse<Process>>(
      `/processes?populate=*&filters[client][id][$eq]=${clientId}`
    ),
  create: (data: Process) => strapiApi.post("/processes", { data }),
  update: (id: string, data: Partial<Process>) =>
    strapiApi.put(`/processes/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/processes/${id}`),
};

export const documentService = {
  getAll: () =>
    strapiApi.get<StrapiResponse<DocumentData>>("/process-documents?populate=*"),
  getById: (id: string) =>
    strapiApi.get<StrapiSingleResponse<DocumentData>>(
      `/process-documents/${id}?populate=*`
    ),
  create: (data: DocumentData) =>
    strapiApi.post("/process-documents", { data }),
  update: (id: string, data: DocumentData) =>
    strapiApi.put(`/process-documents/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/process-documents/${id}`),
};

export const scheduleService = {
  getAll: () => strapiApi.get<StrapiResponse<Schedule>>("/schedules?populate=*"),
  getById: (id: string) =>
    strapiApi.get<StrapiSingleResponse<Schedule>>(`/schedules/${id}?populate=*`),
  getByClient: (clientId: string) =>
    strapiApi.get<StrapiResponse<Schedule>>(
      `/schedules?populate=*&filters[client][id][$eq]=${clientId}`
    ),
  create: (data: Schedule) => strapiApi.post("/schedules", { data }),
  update: (id: string, data: Schedule) =>
    strapiApi.put(`/schedules/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/schedules/${id}`),
};
