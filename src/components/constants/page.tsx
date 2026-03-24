import { Home, Calendar, FileText, User, Users } from "lucide-react";
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
      return "bg-green-100 text-green-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "today":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
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
