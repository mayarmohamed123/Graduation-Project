import { Pharmacy, PharmacyRegistrationResponse, InventoryAnalysis, CategoryDashboardResponse, OrdersDashboardResponse, PharmacyStatsResponse, BestSellingMedicine, TodaySalesByTime, Review } from "@/types";
import { Medicine } from "@/types/medicine";
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

  // Register a new pharmacist/pharmacy
  async register(formData: FormData): Promise<PharmacyRegistrationResponse> {
    interface RawPharmacyRegisterResponse {
      message: string;
      name: string;
      userId: string;
      email: string;
      role: string;
      pharmacistProfileId?: number;
      pharmacistId?: number;
      PharmacistId?: number;
      id?: number;
      pharmacyId?: number;
    }

    const response = await apiRequest<RawPharmacyRegisterResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/register`,
      {
        method: "POST",
        data: formData,
        requiresAuth: false,
      }
    );

    // Handle different possible field names for ID (Mapping from API pharmacistProfileId)
    const pharmacistId = 
      response.pharmacistId || 
      response.pharmacistProfileId || 
      response.PharmacistId || 
      response.id || 
      response.pharmacyId || 
      0;

    return {
      message: response.message || "",
      name: response.name || "",
      userId: response.userId || "",
      email: response.email || "",
      role: response.role || "",
      pharmacistId
    };
  }

  // Create payment session for pharmacy subscription
  async createPharmacySubscriptionSession(
    pharmacistId: number
  ): Promise<{ message: string; sessionUrl: string; sessionId: string }> {
    return await apiRequest<{ message: string; sessionUrl: string; sessionId: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-session`,
      {
        method: "POST",
        data: {
          pharmacistId,
          paymentFor: "PharmacistRegistration",
          amount: 200,
        },
      }
    );
  }

  // Get all medicines for a specific pharmacy
  async getPharmacyMedicines(): Promise<Medicine[]> {
    return await apiRequest<Medicine[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/pharmacy`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Get inventory analysis (stats)
  async getInventoryAnalysis(): Promise<InventoryAnalysis> {
    return await apiRequest<InventoryAnalysis>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/dashboard/inventory`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Get categories dashboard (weekly comparison)
  async getCategoriesDashboard(): Promise<CategoryDashboardResponse> {
    return await apiRequest<CategoryDashboardResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/categories-dashboard`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Get orders dashboard (weekly comparison)
  async getOrdersDashboard(): Promise<OrdersDashboardResponse> {
    return await apiRequest<OrdersDashboardResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/orders-dashboard`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Get pharmacy stats (today vs yesterday)
  async getMyStats(): Promise<PharmacyStatsResponse> {
    return await apiRequest<PharmacyStatsResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/my-stats`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Get best selling medicine
  async getBestSellingMedicine(): Promise<BestSellingMedicine[]> {
    return await apiRequest<BestSellingMedicine[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/best-selling`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Get today's sales by time
  async getTodaySalesByTime(): Promise<TodaySalesByTime[]> {
    return await apiRequest<TodaySalesByTime[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/today-sales-by-time`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Add a new medicine
  async addMedicine(formData: FormData): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine`,
      {
        method: "POST",
        data: formData,
        requiresAuth: true,
      }
    );
  }

  // Update an existing medicine
  async updateMedicine(id: number, formData: FormData): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/${id}`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
  }

  // Delete a medicine
  async deleteMedicine(id: number): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/${id}`,
      {
        method: "DELETE",
        requiresAuth: true,
      }
    );
  }

  // Get a single pharmacy by ID
  async getPharmacyById(id: number): Promise<Pharmacy> {
    return await apiRequest<Pharmacy>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy/${id}`,
      {
        cache: "no-store",
        requiresAuth: false,
      }
    );
  }

  // Get medicines for a specific pharmacy by ID
  async getPharmacyMedicinesById(pharmacyId: number): Promise<Medicine[]> {
    return await apiRequest<Medicine[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicine/pharmacy/${pharmacyId}`,
      {
        cache: "no-store",
        requiresAuth: false,
      }
    );
  }

  // Get Pharmacy Reviews
  async getPharmacyReviews(pharmacyId: number): Promise<Review[]> {
    return await apiRequest<Review[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Review/pharmacy/${pharmacyId}`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }

  // Delete a review
  async deleteReview(reviewId: number): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Review/${reviewId}`,
      {
        method: "DELETE",
        requiresAuth: true,
      }
    );
  }

  // Get Medicine Reviews
  async getMedicineReviews(medicineId: number): Promise<Review[]> {
    return await apiRequest<Review[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Review/medication/${medicineId}`,
      {
        cache: "no-store",
        requiresAuth: true,
      }
    );
  }
}

// 👉 Export a single instance
export const pharmacyService = new PharmacyService();

