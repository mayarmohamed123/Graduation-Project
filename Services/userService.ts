
// Services/userService.ts
import { authService } from "./authService";
import { fetchWithAuth } from "./api";
import type {
  UpdateProfileData,
  UpdateProfileResponse,
  UpdatePasswordData,
  UpdatePasswordResponse,
  ProfilePictureResponse,
  GetUserOrdersResponse,
  GetUserAppointmentsResponse,
  GetUserNotificationsResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class UserService {
  async updateProfile(
    data: UpdateProfileData
  ): Promise<UpdateProfileResponse> {
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);

    return fetchWithAuth(`${API_BASE_URL}/User/update-profile`, {
      method: "PUT",
      body: formData,
    });
  }

  async getUserOrders(): Promise<GetUserOrdersResponse> {
    return fetchWithAuth(`${API_BASE_URL}/order/user-orders`, {
      next: { revalidate: 30 },
    });
  }

  async getUserAppointments(): Promise<GetUserAppointmentsResponse> {
    return fetchWithAuth(`${API_BASE_URL}/appointment/user`, {
      next: { revalidate: 30 },
    });
  }

  async getUserNotifications(): Promise<GetUserNotificationsResponse> {
    return fetchWithAuth(`${API_BASE_URL}/notifications/user`, {
      next: { revalidate: 30 },
    });
  }

  async updatePassword(
    data: UpdatePasswordData
  ): Promise<UpdatePasswordResponse> {
    return fetchWithAuth(`${API_BASE_URL}/User/update-password`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async uploadProfilePicture(image: File): Promise<ProfilePictureResponse> {
    const formData = new FormData();
    formData.append("image", image);

    return fetchWithAuth(`${API_BASE_URL}/User/upload-picture`, {
      method: "POST",
      body: formData,
    });
  }
}

export const userService = new UserService();
