import { ProtectedRoute } from "@/Components";
import { DashboardNavbar, DashboardSidebar } from "@/Components/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar role="admin" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <DashboardNavbar role="admin" />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
