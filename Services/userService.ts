// Services/userService.ts
import { authService } from "./authService";
import type {
  UpdateProfileData,
  UpdateProfileResponse,
  UpdatePasswordData,
  UpdatePasswordResponse,
  ProfilePictureResponse,
  GetUserOrdersResponse,
  GetUserAppointmentsResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class UserService {
  async updateProfile(
    data: UpdateProfileData
  ): Promise<UpdateProfileResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    // Create FormData
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);

    const response = await fetch(`${API_BASE_URL}/User/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let the browser set it with boundary for FormData
      },
      body: formData,
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getUserOrders(): Promise<GetUserOrdersResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/order/user-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getUserAppointments(): Promise<GetUserAppointmentsResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/appointment/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async updatePassword(
    data: UpdatePasswordData
  ): Promise<UpdatePasswordResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/User/update-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async uploadProfilePicture(image: File): Promise<ProfilePictureResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/User/upload-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let the browser set it with boundary for FormData
      },
      body: formData,
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async updateProfilePicture(image: File): Promise<ProfilePictureResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/User/update-picture`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let the browser set it with boundary for FormData
      },
      body: formData,
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}

export const userService = new UserService();
