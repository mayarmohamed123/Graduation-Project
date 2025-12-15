import { authService } from "@/Services/authService";

export interface FilterParams {
  specialty?: string;
  name?: string;
  gender?: string;
  consultationType?: string;
  sort?: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestOptions extends Omit<RequestInit, "method" | "body"> {
  method?: HttpMethod;
  data?: unknown;
  requiresAuth?: boolean;
  returnType?: "json" | "text" | "blob";
}

export const apiRequest = async <T = unknown>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    data,
    requiresAuth = true,
    returnType = "json",
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
    "ngrok-skip-browser-warning": "true",
  };

  // Handle Authentication
  if (requiresAuth) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle Body and Content-Type
  let body: BodyInit | null = null;
  if (data) {
    if (data instanceof FormData) {
      body = data;
      // Content-Type header should not be set for FormData, browser sets it with boundary
      delete headers["Content-Type"];
    } else {
      body = JSON.stringify(data);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      ...restOptions,
    });

    if (response.status === 401 && requiresAuth) {
      authService.logout();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorMessage;
      } catch {
        try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
        } catch {
            // ignore
        }
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {} as T;
    }

    switch (returnType) {
      case "text":
        return (await response.text()) as unknown as T;
      case "blob":
        return (await response.blob()) as unknown as T;
      case "json":
      default:
        return (await response.json()) as T;
    }
  } catch (error) {
    throw error; // Re-throw to be handled by caller
  }
};
