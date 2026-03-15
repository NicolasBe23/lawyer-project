import { Home, Calendar, FileText, User, Users } from "lucide-react";
export const navigationLinks = [
  { href: "/dashboard", icon: Home, label: "dashboard.title" },
  { href: "/dashboard/clients", icon: Users, label: "clients.title" },
  { href: "/dashboard/processes", icon: FileText, label: "processes.title" },

  { href: "/dashboard/schedules", icon: Calendar, label: "schedules.title" },
  { href: "/profile", icon: User, label: "sidebar.profile" },
];

export const getProcessStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "archived":
      return "Archived";
    default:
      return "Pending";
  }
};

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

export const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "overdue":
      return "Needs Confirmation";
    case "today":
      return "Today";
    default:
      return "Upcoming";
  }
};

export const DEFAULT_SHOW_MORE_PAGE_SIZE = 10;
