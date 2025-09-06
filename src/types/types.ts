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
  client: Client;
  process_documents: DocumentData[];
  schedules: Schedule[];
  documents?: null;
}

export interface Schedule {
  id: number;
  title: string;
  description?: string;
  dateTime: string;
  location?: string;
  completed: boolean;
  client?: Client;
  process?: Process;
  createdAt: string;
  updatedAt: string;
  error?: string;
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

export interface DocumentData {
  id: number;
  title: string;
  description?: string;
  file?: File;
  process?: {
    id: number;
    title: string;
    client: {
      id: number;
      name: string;
      email: string;
    };
  };
  uploadDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientWithRelations extends Client {
  attributes: Client["attributes"] & {
    processes?: Process[];
    schedules?: Schedule[];
    user?: {
      id: number;
      username: string;
      email: string;
    };
  };
}

export interface ClientBasicInfoProps {
  client: Client;
  formatDate: (date: string) => string;
}

export interface ClientHeaderProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}

export interface ClientProcessesProps {
  processes: Process[];
  formatDate: (date: string) => string;
}

export interface ClientSchedulesProps {
  schedules: Schedule[];
  formatDateTime: (date: string) => string;
}

export interface ClientSummaryProps {
  client: Client;
  processes: Process[];
  schedules: Schedule[];
  formatDate: (date: string) => string;
}

export interface ClientFormProps {
  onSubmit: (clientData: Partial<Client["attributes"]>) => void;
  initialData?: Client;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export interface ClientsChartProps {
  clientsData: Client[];
}

export interface ProcessesChartProps {
  stats: DashboardStats;
}

export interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  isLoading?: boolean;
}

export interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client["attributes"]>) => void;
  client: Client;
  isLoading?: boolean;
}

export interface StatsCardsProps {
  stats: DashboardStats;
}

export interface ScheduleFormData {
  title: string;
  description?: string;
  dateTime: string;
  location?: string;
  client?: number;
  process?: number;
  schedule?: Schedule;
}

export interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: ScheduleFormData) => void;
  selectedDate?: string;
  isLoading?: boolean;
}
