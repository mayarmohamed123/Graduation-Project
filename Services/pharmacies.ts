import { Medicine, MedicineFilterParams, Pharmacy } from "@/types";
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

  // Filter Medicines
  async filterMedicines(
    filters: MedicineFilterParams
  ): Promise<Medicine[]> {
    const queryParams = new URLSearchParams();

    // Build query parameters from filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/filter${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return await fetchWithAuth(url, {
      next: { revalidate: 60 }, // ✅ ISR enabled
    });
  }

  // Search Medicine by Name
  async searchMedicineByName(name: string): Promise<Medicine[]> {
    return await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/search/${encodeURIComponent(name)}`,
      {
        next: { revalidate: 60 }, // ✅ ISR enabled
      }
    );
  }

  // Get Medicine by ID
  async getMedicineById(id: number): Promise<Medicine> {
    return await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/${id}`,
      {
        next: { revalidate: 60 }, // ✅ ISR enabled
      }
    );
  }
}

// 👉 Export a single instance
export const pharmacyService = new PharmacyService();

