import DoctorNavbar from "@/Components/layout/DoctorNavbar";
export const dynamic = "force-dynamic";
import { DoctorSidebar } from "@/Components/features/doctor";
import { ProtectedRoute } from "@/Components/auth";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <DoctorSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <DoctorNavbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
