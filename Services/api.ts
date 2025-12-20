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
  credentials?: RequestCredentials;
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
    credentials = "include", // Default to include for cookies
    ...restOptions
  } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
    "ngrok-skip-browser-warning": "true",
  };

  // Handle Body and Content-Type
  let body: BodyInit | null = null;
  if (data) {
    if (data instanceof FormData) {
      body = data;
      delete headers["Content-Type"];
    } else {
      body = JSON.stringify(data);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }
  }

  const makeRequest = async () => {
    return fetch(url, {
      method,
      headers,
      body,
      credentials, // Use the passed or default credentials
      ...restOptions,
    });
  };

  try {
    let response = await makeRequest();

    // Handle 401 Unauthorized - attempt to refresh token
    if (response.status === 401 && requiresAuth) {
      try {
        // Attempt to refresh the token
        await authService.refreshToken();
        
        // If refresh succeeded, retry the original request
        response = await makeRequest();
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        authService.logout();
        throw new Error("Session expired. Please log in again.");
      }
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
    throw error;
  }
};
