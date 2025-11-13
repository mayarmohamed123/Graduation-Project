// services/api.ts
import { authService } from "@/Services/authService";
import { Doctor } from "@/types/doctors";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface FilterParams {
  specialty?: string;
  name?: string;
  gender?: string;
  consultationType?: string;
  sort?: string;
}

// Generic fetch function with auth from cookies
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = authService.getToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
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
};
