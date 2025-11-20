import { Pharmacy } from "@/types";

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
}

// 👉 Export a single instance
export const pharmacyService = new PharmacyService();
