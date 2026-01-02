import { PharmacistOrder } from "@/types";
import { apiRequest } from "./api";

class PharmacistService {
  private get baseUrl() {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacist/orders`;
  }

  // Get all orders for the pharmacist
  async getOrders(): Promise<PharmacistOrder[]> {
    return await apiRequest<PharmacistOrder[]>(this.baseUrl, {
      cache: "no-store",
      requiresAuth: true,
    });
  }

  // Get a single order by ID
  async getOrderById(orderId: number): Promise<PharmacistOrder> {
    return await apiRequest<PharmacistOrder>(`${this.baseUrl}/${orderId}`, {
      cache: "no-store",
      requiresAuth: true,
    });
  }

  // Accept an order
  async acceptOrder(orderId: number): Promise<void> {
    await apiRequest<void>(`${this.baseUrl}/${orderId}/accept`, {
      method: "PUT", // User said "endpoint ... that accept order", usually POST/PUT
      requiresAuth: true,
      returnType: "text",
    });
  }

  // Reject/Cancel an order
  async cancelOrder(orderId: number): Promise<void> {
    await apiRequest<void>(`${this.baseUrl}/${orderId}/cancel`, {
      method: "PUT",
      requiresAuth: true,
      returnType: "text",
    });
  }

  // Mark order as delivered
  async markAsDelivered(orderId: number): Promise<void> {
    await apiRequest<void>(`${this.baseUrl}/${orderId}/delivered`, {
      method: "PUT",
      requiresAuth: true,
      returnType: "text",
    });
  }
}

export const pharmacistService = new PharmacistService();
