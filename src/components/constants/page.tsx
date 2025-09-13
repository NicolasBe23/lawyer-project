import { Home, Calendar, FileText, Folder, User, Users } from "lucide-react";
export const navigationLinks = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/processes", icon: FileText, label: "Processes" },
  { href: "/dashboard/documents", icon: Folder, label: "Documents" },
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
