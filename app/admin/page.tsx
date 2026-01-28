import { adminService } from "@/Services/admin/adminService";
import { getAdminPharmacists } from "@/Services/admin/pharmacies";
import AdminDashboardClient from "./AdminDashboardClient";
import { DashboardResponse, TopPerformersResponse } from "@/types";
import { AdminDoctor, AdminPharmacist } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let stats: DashboardResponse | null = null;
  let topPerformers: TopPerformersResponse | null = null;
  let pendingDoctors: AdminDoctor[] = [];
  let pendingPharmacists: AdminPharmacist[] = [];

  try {
    const [statsData, performersData, allDoctors, allPharmacists] = await Promise.all([
      adminService.getDashboardStats(),
      adminService.getTopPerformers(),
      adminService.getAllDoctors(),
      getAdminPharmacists(),
    ]);

    stats = statsData;
    topPerformers = performersData;

    // Filter and sort pending doctors
    pendingDoctors = allDoctors
      .filter(d => !d.isApproved && !d.isRejected)
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);

    // Filter and sort pending pharmacists
    pendingPharmacists = (allPharmacists || [])
      .filter(p => !p.isApproved && !p.isReject)
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
  }

  return (
    <AdminDashboardClient
      initialData={{
        stats,
        topPerformers,
        pendingDoctors,
        pendingPharmacists,
      }}
    />
  );
}
