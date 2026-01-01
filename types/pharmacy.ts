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
