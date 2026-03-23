import Sidebar from "@/components/sidebar/page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <Sidebar />
      <main className="min-w-0 overflow-x-hidden overflow-y-auto px-4 pb-4 pt-20 md:ml-60 md:p-6">
        {children}
      </main>
    </div>
  );
}
