import DoctorNavbar from "@/components/layout/DoctorNavbar";
import { DoctorSidebar } from "@/components/features/doctor";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <DoctorNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
