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
