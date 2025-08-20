import axios from "axios";
import { Client, Document, Process, Schedule } from "../types/types";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const strapiApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

strapiApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("strapi_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

export const clientService = {
  getAll: () => strapiApi.get("/clients?populate=*"),
  getById: (id: string) => strapiApi.get(`/clients/${id}?populate=*`),
  create: (data: Client) => strapiApi.post("/clients", { data }),
  update: (id: string, data: Client) =>
    strapiApi.put(`/clients/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/clients/${id}`),
};

export const processService = {
  getAll: () => strapiApi.get("/processes?populate=*"),
  getById: (id: string) => strapiApi.get(`/processes/${id}?populate=*`),
  create: (data: Process) => strapiApi.post("/processes", { data }),
  update: (id: string, data: Process) =>
    strapiApi.put(`/processes/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/processes/${id}`),
};

export const documentService = {
  getAll: () => strapiApi.get("/documents?populate=*"),
  getById: (id: string) => strapiApi.get(`/documents/${id}?populate=*`),
  create: (data: Document) => strapiApi.post("/documents", { data }),
  update: (id: string, data: Document) =>
    strapiApi.put(`/documents/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/documents/${id}`),
};

export const scheduleService = {
  getAll: () => strapiApi.get("/schedules?populate=*"),
  getById: (id: string) => strapiApi.get(`/schedules/${id}?populate=*`),
  create: (data: Schedule) => strapiApi.post("/schedules", { data }),
  update: (id: string, data: Schedule) =>
    strapiApi.put(`/schedules/${id}`, { data }),
  delete: (id: string) => strapiApi.delete(`/schedules/${id}`),
};
