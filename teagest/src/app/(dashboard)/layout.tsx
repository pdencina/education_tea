import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/80 via-white to-pastel-lavender/20">
        {children}
      </main>
    </div>
  );
}
