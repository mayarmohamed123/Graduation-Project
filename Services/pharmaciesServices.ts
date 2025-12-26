import { Pharmacy } from "@/types";
import { apiRequest } from "./api";

class PharmacyService {
  // Get The All pharmacies
  async getPharmacies(): Promise<Pharmacy[]> {
    const res = await apiRequest<{ data: Pharmacy[] } | Pharmacy[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy`,
      {
        cache: "no-store", // ✅ Caching disabled
        requiresAuth: false,
      }
    );
    if ("data" in res) return res.data;
    return res;
  }

  // Get Top Rated Pharmacies
  async getTopRatedPharmacies(): Promise<Pharmacy[]> {
    const res = await apiRequest<{ data: Pharmacy[] } | Pharmacy[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacy/top-pharmacies`,
      {
        cache: "no-store",
        requiresAuth: false,
      }
    );
    if ("data" in res) return res.data;
    return res;
  }
}

// 👉 Export a single instance
export const pharmacyService = new PharmacyService();

