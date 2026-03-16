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

export interface StrapiRelation<T> {
  data: T | null;
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
  client: {
    id: number;
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
    documentId: string;
    locale?: string;
  } | null;
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

export interface StrapiFile {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
  ext: string;
}

export interface DocumentData {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  file?: StrapiFile;
  process?: {
    id: number;
    documentId?: string;
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

export interface DocumentFormData {
  title: string;
  description?: string;
  process?: number;
  file?: File;
}

export interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DocumentFormData) => Promise<void>;
  processId?: string;
  isLoading?: boolean;
}

export interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string | null;
  }) => Promise<void>;
  document: DocumentData;
  isLoading?: boolean;
}

export interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  documentTitle: string;
  isLoading?: boolean;
}

export interface DocumentsHeaderProps {
  processId: string | null;
  onBackClick: () => void;
  onAddClick: () => void;
}

export interface DocumentCardProps {
  document: DocumentData;
  processId: string | null;
  uploadingDocId: number | null;
  removingFileDocId: number | null;
  onEditClick: (e: React.MouseEvent, doc: DocumentData) => void;
  onDeleteClick: (e: React.MouseEvent, doc: DocumentData) => void;
  onOpenFile: (e: React.MouseEvent, doc: DocumentData) => void;
  onUploadClick: (e: React.MouseEvent, docId: number) => void;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    doc: DocumentData,
  ) => void;
  onRemoveFile: (e: React.MouseEvent, doc: DocumentData) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  formatDate: (date: string) => string;
}

export interface DocumentsListProps {
  documents: DocumentData[];
  processId: string | null;
  uploadingDocId: number | null;
  removingFileDocId: number | null;
  onEditClick: (e: React.MouseEvent, doc: DocumentData) => void;
  onDeleteClick: (e: React.MouseEvent, doc: DocumentData) => void;
  onOpenFile: (e: React.MouseEvent, doc: DocumentData) => void;
  onUploadClick: (e: React.MouseEvent, docId: number) => void;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    doc: DocumentData,
  ) => void;
  onRemoveFile: (e: React.MouseEvent, doc: DocumentData) => void;
  fileInputRefs: React.MutableRefObject<{
    [key: number]: HTMLInputElement | null;
  }>;
  formatDate: (date: string) => string;
}

export interface DocumentEmptyStateProps {
  processId: string | null;
  onAddClick: () => void;
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

export interface ScheduleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
  selectedDate: string;
  onCreateNew: () => void;
  onDeleteSchedule?: (scheduleId: number) => Promise<void>;
  onMarkCompleted?: (scheduleId: number) => void;
  onMarkNotCompleted?: (scheduleId: number) => void;
}

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export interface ProcessClientInfoProps {
  client: {
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;
}

export interface ProcessDatesProps {
  startDate: string;
  completionDate?: string;
  formatDate: (date: string) => string;
}

export interface ProcessDocumentsProps {
  documents: DocumentData[];
  formatDate: (date: string) => string;
}

export interface ProcessSchedulesProps {
  schedules: Schedule[];
}

export interface ProcessStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export interface ProcessStatusChangerProps {
  processId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export interface ProcessUpdateData {
  processStatus?: "active" | "archived" | "completed";
  title?: string;
  description?: string;
  startDate?: string;
  completionDate?: string;
}

export interface ExtendedProcessDocumentsProps extends ProcessDocumentsProps {
  processId: string;
}

export interface DashboardContentProps {
  user: User;
}

export interface EditProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: Process;
  isLoading?: boolean;
  onSave: (data: {
    processNumber: string;
    title: string;
    description?: string;
    startDate: string;
    completionDate?: string;
  }) => Promise<void>;
}

export type ClientFilter = "all" | "active" | "inactive";

export type ProcessFilter = "all" | "active" | "completed" | "archived";

export type ListFilterOption<T extends string> = {
  value: T;
  label: string;
};

export interface ListFilterDropdownProps<T extends string> {
  value: T;
  options: ListFilterOption<T>[];
  onChange: (value: T) => void;
}

export interface ListSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}
