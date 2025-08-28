import Sidebar from "@/components/sidebar/page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
