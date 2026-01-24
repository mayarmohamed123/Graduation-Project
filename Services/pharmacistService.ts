import {
  PharmacistOrder,
  Notification,
  PharmacyProfile,
  PharmacistProfile,
  PharmacyDailyRevenue,
  SalesByCategory,
  OrdersDashboardResponse,
  OutOfStockData,
  InventoryReportData,
  PharmacyAnalyticsStats,
} from "@/types";
import { apiRequest } from "./api";

class PharmacistService {
  private get baseUrl() {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacist/orders`;
  }

  // Get all orders for the pharmacist
  async getOrders(): Promise<PharmacistOrder[]> {
    return await apiRequest<PharmacistOrder[]>(this.baseUrl, {
      requiresAuth: true,
    });
  }

  // Get a single order by ID
  async getOrderById(orderId: number): Promise<PharmacistOrder> {
    return await apiRequest<PharmacistOrder>(`${this.baseUrl}/${orderId}`, {
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

  // Get pharmacist notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await apiRequest<{ notifications: Notification[] }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/user`,
      { requiresAuth: true }
    );
    return response.notifications;
  }

  // Mark notification as read
  async markNotificationAsRead(id: number): Promise<void> {
    await apiRequest<void>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Notifications/${id}/read`,
      { method: "PUT", requiresAuth: true }
    );
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(): Promise<void> {
    await apiRequest<void>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Notifications/read-all`,
      { method: "PUT", requiresAuth: true }
    );
  }

  // Update pharmacist profile
  async updatePharmacistProfile(
    data: PharmacistProfile
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("UserName", data.UserName);
    formData.append("email", data.email);

    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/User/update-profile`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
  }

  // Upload pharmacist profile picture
  async uploadPharmacistPicture(image: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("image", image);
    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/User/upload-picture`,
      {
        method: "POST",
        data: formData,
        requiresAuth: true,
      }
    );
  }

  // Update pharmacy profile
  async updatePharmacyProfile(
    formData: FormData
  ): Promise<{ message: string }> {
    return await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/update-pharmacy`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
  }

  // Get pharmacy profile
  async getPharmacyProfile(): Promise<PharmacyProfile> {
    return await apiRequest<PharmacyProfile>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy/GetPharmacyOfPharmacist`,
      {
        requiresAuth: true,
      }
    );
  }

  // Analytics: Daily Revenue
  async getDailyRevenue(
    year: number,
    month: number
  ): Promise<PharmacyDailyRevenue[]> {
    return await apiRequest<PharmacyDailyRevenue[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/daily-revenue?year=${year}&month=${month}`,
      { requiresAuth: true }
    );
  }

  // Analytics: Sales by Category
  async getSalesByCategory(
    year: number,
    month: number
  ): Promise<SalesByCategory[]> {
    return await apiRequest<SalesByCategory[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/sales-by-category?year=${year}&month=${month}`,
      { requiresAuth: true }
    );
  }

  // Orders Dashboard Stats
  async getOrdersDashboardStats(): Promise<OrdersDashboardResponse> {
    return await apiRequest<OrdersDashboardResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/orders-dashboard`,
      { requiresAuth: true }
    );
  }

  // Analytics: Out of Stock (Last 30 Days)
  async getOutOfStockLast30Days(): Promise<OutOfStockData[]> {
    return await apiRequest<OutOfStockData[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/out-of-stock/last-30-days`,
      { requiresAuth: true }
    );
  }

  // Analytics: Inventory Report (Last 30 Days)
  async getInventoryReportLast30Days(): Promise<InventoryReportData[]> {
    return await apiRequest<InventoryReportData[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/inventoryreport-last-30-days`,
      { requiresAuth: true }
    );
  }

  // Analytics: Get Overview Stats
  async getAnalyticsStats(): Promise<PharmacyAnalyticsStats> {
    return await apiRequest<PharmacyAnalyticsStats>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacties/GetAnalyticsStats`,
      { requiresAuth: true }
    );
  }
}

export const pharmacistService = new PharmacistService();
