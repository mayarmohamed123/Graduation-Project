import {
  Medicine,
  MedicineFilterParams,
  MedicineSearchResponse,
} from "@/types";
import { fetchWithAuth } from "./api";

class MedicineService {
  // Filter Medicines
  async filterMedicines(filters: MedicineFilterParams): Promise<Medicine[]> {
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
  async searchMedicineByName(name: string): Promise<MedicineSearchResponse> {
    return await fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/medicine/search/${encodeURIComponent(name)}`,
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

  // Get Alternatives Medicines
  async getAlternativesMedicines(name: string): Promise<Medicine[]> {
    return await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/${encodeURIComponent(
        name
      )}/alternatives`,
      {
        next: { revalidate: 60 }, // ✅ ISR enabled
      }
    );
  }
}

// 👉 Export a single instance
export const medicineService = new MedicineService();
