import { User } from "@/types";
import { apiRequest } from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  phonenumber: string;
  address: string;
  password: string;
  confirmpassword: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: {
    userName: string;
    email: string;
    roles: string[] | string;
    id?: string;
  };
}

export interface RegisterResponse {
  message: string;
  role: string;
  user: {
    userName: string;
    email: string;
    roles: string[] | string;
    id?: string;
  };
}

export interface ForgotPasswordResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

class AuthService {
  async getProfile(): Promise<User> {
    return apiRequest<User>(`${API_BASE_URL}/User/profile`, {
      method: "GET",
      requiresAuth: true,
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(`${API_BASE_URL}/User/login`, {
      method: "POST",
      data: credentials,
      requiresAuth: false,
    });
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>(`${API_BASE_URL}/User/register`, {
      method: "POST",
      data: credentials,
      requiresAuth: false,
    });
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiRequest<ForgotPasswordResponse>(
      `${API_BASE_URL}/User/forgot-password`,
      {
        method: "POST",
        data: { email },
        requiresAuth: false,
      }
    );
  }

  async resetPassword(email: string, token: string, newpassword: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${API_BASE_URL}/User/reset-password`,
      {
        method: "POST",
        data: { email, token, newpassword },
        requiresAuth: false,
      }
    );
  }

  async googleLogin(): Promise<void> {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/User/google-login`;
  }

  async facebookLogin(): Promise<void> {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/User/facebook-login`;
  }

  async refreshToken(): Promise<void> {
    return apiRequest<void>(`${API_BASE_URL}/User/refresh`, {
      method: "POST",
      requiresAuth: false,
      returnType: "text",
    });
  }

  async logout(): Promise<void> {
    try {
      await apiRequest(`${API_BASE_URL}/User/logout`, {
        method: "POST",
        requiresAuth: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Refresh to clear any client-side state
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }
}

export const authService = new AuthService();
