/**
 * Pharmacist-related types for order management
 */

/**
 * Order item in a pharmacist order
 */
export interface PharmacistOrderItem {
  medicationId: number;
  medicicationImage: string; // Note: keeping API's typo for consistency
  medicationName: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Order status types
 */
export type PharmacistOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Delivered"
  | "Cancelled";

/**
 * Payment status types
 */
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

/**
 * Pharmacist order entity from the API
 */
export interface PharmacistOrder {
  id: number;
  userId: string;
  userName: string;
  userImage: string;
  userEmail: string;
  pharmacyId: number;
  pharmacyName: string;
  pharmacyImage: string;
  city: string;
  country: string;
  street: string;
  phoneNumber: string;
  totalPrice: number;
  status: PharmacistOrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO datetime string
  items: PharmacistOrderItem[];
}

/**
 * Get pharmacist orders API response
 */
export type GetPharmacistOrdersResponse = PharmacistOrder[];

/**
 * Pharmacy profile data for the pharmacist
 */
export interface PharmacyProfile {
  id: number;
  name: string;
  city: string;
  phone: string;
  country: string;
  street: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  deliveryFee: number;
  imagePath: string;
  averageRating?: number;
  distanceFromUser?: number | null;
  // Keep these for backward compatibility or if used in update
  Street?: string;
  PostalCode?: string;
  Latitude?: number;
  Longitude?: number;
  DeliveryFee?: number;
  LicenseNumber?: string;
}
export interface PharmacistProfile {
  UserName: string;
  email: string;
}

/**
 * Daily revenue data for pharmacy analytics
 */
export interface PharmacyDailyRevenue {
  date: string;
  totalRevenue: number;
  [key: string]: unknown;
}

/**
 * sales by category
 */
export interface SalesByCategory {
  category: string;
  totalSales: number;
  percentage: number;
  [key: string]: unknown;
}

/**
 * Dashboard week statistics
 */
export interface DashboardWeekStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  delieveredOrders: number;
  totalRevenue: number;
}

/**
 * Orders dashboard API response
 */
export interface OrdersDashboardResponse {
  thisWeek: DashboardWeekStats;
  lastWeek: DashboardWeekStats;
}

/**
 * Out of stock data for analytics
 */
export interface OutOfStockData {
  date: string;
  count: number;
}

/**
 * Inventory report data for analytics
 */
export interface InventoryReportData {
  date: string;
  quantity: number;
}

/**
 * Pharmacy analytics statistics
 */
export interface PharmacyAnalyticsStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
}
