import { LucideIcon } from "lucide-react";

export interface Client {
  id: number;
  attributes: {
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    birthDate?: string;
    observations?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Process {
  id: number;
  documentId: string;
  processNumber: string;
  title: string;
  description?: string;
  processStatus: "active" | "archived" | "completed";
  startDate: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client: Client; // Cliente vem diretamente, não em data
  process_documents: Document[];
  schedules: Schedule[];
  documents?: null; // Parece ser sempre null baseado na resposta
}

export interface Document {
  id: number;
  attributes: {
    title: string;
    description?: string;
    file: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
          size: number;
          ext: string;
        };
      };
    };
    process?: {
      data: Process;
    };
    uploadDate: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Schedule {
  id: number;
  attributes: {
    title: string;
    description?: string;
    dateTime: string;
    location?: string;
    client?: {
      data: Client;
    };
    process?: {
      data: Process;
    };
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  provider?: string;
  documentId?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
}

export interface StrapiError {
  response?: {
    data?: {
      error?: {
        message?: string;
        name?: string;
        status?: number;
      };
    };
  };
}

export interface DashboardStats {
  clients: number;
  processes: number;
  documents: number;
  schedules: number;
  clientsThisMonth: number;
  activeProcesses: number;
  schedulesThisWeek: number;
  newDocuments: number;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}
