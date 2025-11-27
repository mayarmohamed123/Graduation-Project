import { StaticImageData } from "next/image";

/**
 * User entity from the API
 */
export interface User {
  id: string;
  email: string;
  userName: string;
  roles?: string[];
  phoneNumber?: string;
  profileImage?: string;
  address?: string;
}

/**
 * User profile data for form state
 */
export interface UserProfileForm {
  username: string;
  email: string;
  phone: string;
  address: string;
  image: string | StaticImageData;
}

/**
 * Update profile request data
 */
export interface UpdateProfileData {
  userName: string;
  email: string;
  address: string;
  phoneNumber: string;
}

/**
 * Update profile API response
 */
export interface UpdateProfileResponse {
  message: string;
}

/**
 * Update password request data
 */
export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Update password API response
 */
export interface UpdatePasswordResponse {
  message: string;
}

/**
 * Profile picture upload/update API response
 */
export interface ProfilePictureResponse {
  message: string;
}



/**
 * Redux user slice state
 */
export interface UserSliceState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Order item in an order
 */
export interface OrderItem {
  medicationName: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Order entity from the API
 */
export interface Order {
  id: number;
  email: string;
  totalPrice: number;
  pharmacyId: number;
  status: string;
  items: OrderItem[];
}

/**
 * Get user orders API response
 */
export type GetUserOrdersResponse = Order[];

/**
 * Appointment entity from the API
 */
export interface Appointment {
  id: number;
  doctorName: string;
  userName: string;
  clinicName: string;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  status: string; // "confirmed", "completed", "cancelled", etc.
}

/**
 * Get user appointments API response
 */
export type GetUserAppointmentsResponse = Appointment[];
