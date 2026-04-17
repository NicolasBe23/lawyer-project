import {
  Home,
  Calendar,
  FileText,
  User,
  Users,
  FolderOpen,
  BarChart3,
  Shield,
} from "lucide-react";

export const LANDING_FEATURES = [
  {
    id: "clients",
    icon: Users,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "processes",
    icon: FolderOpen,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
  },
  {
    id: "calendar",
    icon: Calendar,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
  },
  {
    id: "documents",
    icon: FileText,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
  },
  {
    id: "reports",
    icon: BarChart3,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "security",
    icon: Shield,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
  },
] as const;

export const LANDING_STEPS = [
  { number: "01", key: "step1" },
  { number: "02", key: "step2" },
  { number: "03", key: "step3" },
] as const;

export const LANDING_TESTIMONIALS = [
  {
    id: "rodrigo",
    name: "Dr. Rodrigo Almeida",
    role: "Advogado Trabalhista — São Paulo, BR",
    initials: "RA",
    rating: 5,
  },
  {
    id: "fernanda",
    name: "Dra. Fernanda Queiroz",
    role: "Advogada Cível — Rio de Janeiro, BR",
    initials: "FQ",
    rating: 5,
  },
  {
    id: "marcelo",
    name: "Dr. Marcelo Teixeira",
    role: "Advogado Empresarial — Porto, PT",
    initials: "MT",
    rating: 5,
  },
  {
    id: "camila",
    name: "Dra. Camila Nogueira",
    role: "Advogada de Família — Braga, PT",
    initials: "CN",
    rating: 5,
  },
] as const;

export const navigationLinks = [
  { href: "/dashboard", icon: Home, label: "dashboard.title" },
  { href: "/dashboard/clients", icon: Users, label: "clients.title" },
  { href: "/dashboard/processes", icon: FileText, label: "processes.title" },
  { href: "/dashboard/schedules", icon: Calendar, label: "schedules.title" },
  { href: "/profile", icon: User, label: "sidebar.profile" },
];

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/15 text-green-400";
    case "overdue":
      return "bg-red-500/15 text-red-400";
    case "today":
      return "bg-blue-500/15 text-blue-400";
    default:
      return "bg-gray-700 text-gray-300";
  }
};

export const DEFAULT_SHOW_MORE_PAGE_SIZE = 10;

export const CLIENT_FILTER_OPTIONS = [
  { value: "all", labelKey: "clients.filterAll" },
  { value: "active", labelKey: "clients.filterActive" },
  { value: "inactive", labelKey: "clients.filterInactive" },
] as const;

export const PROCESS_FILTER_OPTIONS = [
  { value: "all", labelKey: "processes.filterAll" },
  { value: "active", labelKey: "dashboard.active" },
  { value: "completed", labelKey: "dashboard.completed" },
  { value: "archived", labelKey: "dashboard.archived" },
] as const;
