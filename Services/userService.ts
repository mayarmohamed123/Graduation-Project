// Services/userService.ts

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
import { apiRequest } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);

    return apiRequest<UpdateProfileResponse>(
      `${API_BASE_URL}/User/update-profile`,
      {
        method: "PUT",
        data: formData,
      }
    );
  }

  async getUserOrders(): Promise<GetUserOrdersResponse> {
    return apiRequest<GetUserOrdersResponse>(
      `${API_BASE_URL}/order/user-orders`,
      {}
    );
  }

  async getUserAppointments(): Promise<GetUserAppointmentsResponse> {
    return apiRequest<GetUserAppointmentsResponse>(
      `${API_BASE_URL}/appointment/user`,
      {}
    );
  }

  async getUserNotifications(): Promise<GetUserNotificationsResponse> {
    return apiRequest<GetUserNotificationsResponse>(
      `${API_BASE_URL}/notifications/user`,
      {}
    );
  }

  async updatePassword(
    data: UpdatePasswordData
  ): Promise<UpdatePasswordResponse> {
    return apiRequest<UpdatePasswordResponse>(
      `${API_BASE_URL}/User/update-password`,
      {
        method: "PUT",
        data, // apiRequest handles JSON stringify
      }
    );
  }

  async uploadProfilePicture(image: File): Promise<ProfilePictureResponse> {
    const formData = new FormData();
    formData.append("image", image);

    return apiRequest<ProfilePictureResponse>(
      `${API_BASE_URL}/User/upload-picture`,
      {
        method: "POST",
        data: formData,
      }
    );
  }

  async updateUserLocation(latitude: number, longitude: number): Promise<void> {
    return apiRequest<void>(`${API_BASE_URL}/User/location`, {
      method: "PUT",
      data: {
        Latitude: latitude,
        Longitude: longitude,
      },
    });
  }
}

export const userService = new UserService();
