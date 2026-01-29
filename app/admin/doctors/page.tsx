export const dynamic = "force-dynamic";

import { adminService } from "@/Services/admin/adminService";
import DoctorsManagementClient from "./DoctorsManagementClient";
import { AdminDoctor } from "@/types/admin";

export default async function DoctorsManagement() {
    let doctors: AdminDoctor[] = [];
    try {
        doctors = await adminService.getAllDoctors();
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
    }

    return <DoctorsManagementClient initialDoctors={doctors} />;
}

