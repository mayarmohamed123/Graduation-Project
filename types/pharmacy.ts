export interface Pharmacy {
  id: number;
  name: string;
  phone: string;
  averageRating: number;
  city: string;
  imagePath: string;
  postalCode: string;
  country: string;
  street: string;
  latitude: number;
  longitude: number;
  distanceFromUser?: number | null;
  deliveryFee?: number;
}

export interface PharmacyRegistrationResponse {
    message: string;
    name: string;
    userId: string;
    email: string;
    role: string;
}

export interface InventoryAnalysis {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
}

export interface CategoryWeeklyStats {
    categoryName: string;
    itemsCount: number;
}

export interface CategoryDashboardResponse {
    thisWeek: CategoryWeeklyStats[];
    lastWeek: CategoryWeeklyStats[];
}

export interface OrdersDashboardData {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    cancelledOrders: number;
    delieveredOrders: number;
    totalRevenue: number;
}

export interface OrdersDashboardResponse {
    thisWeek: OrdersDashboardData;
    lastWeek: OrdersDashboardData;
}

export interface PharmacyStatsResponse {
    todayOrders: number;
    yesterdayOrders: number;
    todayRevenue: number;
    yesterdayRevenue: number;
    availableStock: number;
    outOfStock: number;
    pendingOrders: number;
}

export interface BestSellingMedicine {
    name: string;
    sales: number;
}

export interface TodaySalesByTime {
    timeSlot: string;
    salesCount: number;
}
