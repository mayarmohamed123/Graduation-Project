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
  // Server-side fix: absolute URL is required for fetch during SSR/Build
  let finalUrl = url;
  if (typeof window === "undefined" && !url.startsWith("http")) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    if (url.startsWith("/api")) {
      // Replace /api prefix with the full backend URL if BACKEND_URL doesn't end with /api
      const baseWithNoApi = BACKEND_URL.replace(/\/api$/, "");
      finalUrl = baseWithNoApi + (url.startsWith("/") ? url : "/" + url);
    } else {
      // For other relative paths
      finalUrl = BACKEND_URL + (url.startsWith("/") ? url : "/" + url);
    }
    
    // Safety check: ensure no double slashes like http://localhost:5000//api
    finalUrl = finalUrl.replace(/([^:]\/)\/+/g, "$1");
    // Only log if it's still relative (which shouldn't happen if BACKEND_URL is absolute)
    if (!finalUrl.startsWith("http")) {
      console.warn(`[apiRequest] WARNING: Final URL is still relative on server: ${finalUrl}. BACKEND_URL was: ${BACKEND_URL}`);
    }
  }

  // Determine cache strategy: mutations should not be cached
  const isMutation = method !== "GET";
  const cacheRevalidate = isMutation ? 0 : (revalidate ?? 3);

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
    "ngrok-skip-browser-warning": "true",
  };

  // Server-side fix: forward cookies to the backend
  // Always forward cookies if we have them on the server, especially for refresh calls
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }
    } catch (e) {
      if (requiresAuth) {
        console.warn("[apiRequest] Could not forward cookies on server:", e);
      }
    }
  }

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
      // On client-side, check if refresh token cookie exists before attempting refresh
      // This prevents unnecessary 401 errors on public pages (like login) when user is not authenticated
      const hasRefreshToken = typeof window !== "undefined" 
        ? document.cookie.includes("refresh_token")
        : true; // On server-side, always try refresh (cookies are forwarded)
      
      if (hasRefreshToken) {
        try {
          // Attempt to refresh the token
          await authService.refreshToken();
          // If refresh succeeded, retry the original request
          response = await makeRequest();
        } catch {
          // Refresh failed, continue with original 401 response
        }
      }
    }

    if (!response.ok) {
      console.error(`API request failed: ${method} ${finalUrl} - Status: ${response.status}`);
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
