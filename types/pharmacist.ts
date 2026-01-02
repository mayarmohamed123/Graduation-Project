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
