import {
  Medicine,
  MedicineFilterParams,
  MedicineSearchResponse,
} from "@/types";
import { apiRequest } from "./api";

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

    return await apiRequest<Medicine[]>(url, {});
  }

  // Search Medicine by Name
  async searchMedicineByName(name: string): Promise<MedicineSearchResponse> {
    return await apiRequest<MedicineSearchResponse>(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/medicine/search/${encodeURIComponent(name)}`,
      {}
    );
  }

  // Get Medicine by ID
  async getMedicineById(id: number): Promise<Medicine> {
    return await apiRequest<Medicine>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/${id}`,
      {}
    );
  }

  // Get Alternatives Medicines
  async getAlternativesMedicines(name: string): Promise<Medicine[]> {
    return await apiRequest<Medicine[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/${encodeURIComponent(
        name
      )}/alternatives`,
      {}
    );
  }
}

// 👉 Export a single instance
export const medicineService = new MedicineService();
