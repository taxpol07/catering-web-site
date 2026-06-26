import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-[calc(100vh-5rem)]">
        <AdminSidebar />
        <div className="flex-1 overflow-auto bg-surface-950 p-6 lg:p-8">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
