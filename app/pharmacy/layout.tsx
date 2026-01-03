import { ProtectedRoute } from "@/Components";
import { DashboardNavbar, DashboardSidebar } from "@/Components/layout";
export const dynamic = "force-dynamic";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar role="pharmacy" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <DashboardNavbar role="pharmacy" />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
   </ProtectedRoute>
  );
}
