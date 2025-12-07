import { Pharmacy } from "@/types";
import { fetchWithAuth } from "./api";

class PharmacyService {
  // Get The All pharmacies
  async getPharmacies(): Promise<Pharmacy[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy`,
      {
        next: { revalidate: 60 }, // ✅ ISR enabled
      }
    );

    if (!res.ok) {
      throw new Error("Failed to load pharmacies");
    }

    const json = await res.json();
    return (json.data || json) as Pharmacy[];
  }

  // Get Top Rated Pharmacies
  async getTopRatedPharmacies(): Promise<Pharmacy[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacy/top-pharmacies`,
      {
        next: { revalidate: 60 }, 
      }
    );

    if (!res.ok) {
      throw new Error("Failed to load top-rated pharmacies");
    }

    const json = await res.json();
    return (json.data || json) as Pharmacy[];
  }



}

// 👉 Export a single instance
export const pharmacyService = new PharmacyService();

