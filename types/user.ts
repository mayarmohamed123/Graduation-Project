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
  specialty?: string;
  gender?: string;
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
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Order item in an order
 */
export interface OrderItem {
  medicationId: number;
  medicationName: string;
  medicicationImage?: string; // Note: keeping API's typo for consistency
  quantity: number;
  unitPrice: number;
}

/**
 * Order entity from the API
 */
export interface Order {
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
  status: string;
  paymentStatus: string;
  createdAt: string; // ISO datetime string
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
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorImage: string | null;
  userId: string;
  userName: string;
  userImage: string | null;
  clinicId: number;
  clinicName: string;
  clinicImage: string | null;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  status: string; // "pending", "confirmed", "completed", "cancelled", etc.
}

/**
 * Get user appointments API response
 */
export type GetUserAppointmentsResponse = Appointment[];

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category?: "appointment" | "order";
  user: User | null;
  isRead: boolean;
  createdAt: string; // ISO datetime string
}

/**
 * Notification types
 */
export type NotificationType =
  | "orderConfirmed"
  | "orderDelivered"
  | "orderCancelled"
  | "appointmentApproved"
  | "appointmentStartingSoon"
  | "newAppointmentForDoctor"
  | "inventoryLowStock"
  | "newOrderForPharmacist"
  | "inventoryOutOfStock";

/**
 * Get user notifications API response
 */
export interface GetUserNotificationsResponse {
  orders: Notification[];
  appointments: Notification[];
}
