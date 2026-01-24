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
  revalidate?: number | false; // ISR revalidation in seconds, false to disable caching
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
    revalidate,
    ...restOptions
  } = options;

  let finalUrl = url;
  
  // Server-side fix: absolute URL is required for fetch
  if (typeof window === "undefined" && url.startsWith("/api")) {
    const internalBaseUrl = process.env.INTERNAL_API_BASE_URL || "https://webadd-avgnfdemdqcffecu.canadacentral-01.azurewebsites.net/api";
    finalUrl = url.replace("/api", internalBaseUrl);
  } else if (typeof window === "undefined" && !url.startsWith("http")) {
      // Handle cases where the URL might not start with /api but is still relative
      const internalBaseUrl = process.env.INTERNAL_API_BASE_URL || "https://webadd-avgnfdemdqcffecu.canadacentral-01.azurewebsites.net/api";
      // If it doesn't start with /api, we assume it's relative to the base domain
      finalUrl = `${internalBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  
  // Determine cache strategy: mutations should not be cached
  const isMutation = method !== "GET";
  const cacheRevalidate = isMutation ? 0 : (revalidate ?? 3);

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
    return fetch(finalUrl, {
      method,
      headers,
      body,
      credentials, // Use the passed or default credentials
      next: { revalidate: cacheRevalidate }, // ISR with configurable revalidation
      ...restOptions,
    });
  };

  try {
    let response = await makeRequest();

    // Handle 401 Unauthorized - attempt to refresh token
    if (response.status === 401 && requiresAuth) {
        // Attempt to refresh the token
        await authService.refreshToken();
        // If refresh succeeded, retry the original request
        response = await makeRequest();
    }

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.message || errorText || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      } catch {
        // ignore if text() fails
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
