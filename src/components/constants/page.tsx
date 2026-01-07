import { Home, Calendar, FileText, User, Users } from "lucide-react";
export const navigationLinks = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/processes", icon: FileText, label: "Processes" },

  { href: "/dashboard/schedules", icon: Calendar, label: "Schedule" },
  { href: "/profile", icon: User, label: "Profile" },
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
