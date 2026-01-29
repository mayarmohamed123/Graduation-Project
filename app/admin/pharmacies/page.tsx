export const dynamic = "force-dynamic";

import { getAdminPharmacists } from "@/Services/admin/pharmacies";
import PharmaciesManagementClient from "./PharmaciesManagementClient";
import { AdminPharmacist } from "@/types/admin";

export default async function PharmaciesManagement() {
    let pharmacists: AdminPharmacist[] = [];
    try {
        pharmacists = await getAdminPharmacists();
    } catch (error) {
        console.error("Failed to fetch pharmacists:", error);
    }

    return <PharmaciesManagementClient initialPharmacists={pharmacists} />;
}
