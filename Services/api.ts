// services/api.ts
import { authService } from "@/Services/authService";

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

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to application/json if body is NOT FormData
  // and Content-Type isn't explicitly set (though spreading options.headers handles the explicit set usually, 
  // we just want to avoid overwriting it or setting it for FormData)
  if (
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

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
// POST request with token + JSON body
export const postWithAuth = async (
  url: string,
  data?: unknown,
  options: RequestInit = {}
) => {
  const token = authService.getToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  const isFormData = data instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    body: isFormData ? (data as FormData) : data ? JSON.stringify(data) : undefined,
    ...options,
    headers,
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
};

// POST request that returns raw text response
export const postWithAuthText = async (
  url: string,
  data?: unknown,
  options: RequestInit = {}
) => {
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
    method: "POST",
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...options,
    headers,
  });

  if (response.status === 401) {
    authService.logout();
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => null);
    throw new Error(
      errorText || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
};

// DELETE request that returns raw text response
export const deleteWithAuthText = async (
  url: string,
  options: RequestInit = {}
) => {
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
    method: "DELETE",
    ...options,
    headers,
  });

  if (response.status === 401) {
    authService.logout();
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => null);
    throw new Error(
      errorText || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
};
