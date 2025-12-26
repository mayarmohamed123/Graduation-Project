import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ||
  "https://unendingly-unfoul-emmy.ngrok-free.dev";

export async function GET(request: NextRequest) {
  // Check for auth tokens in cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // No tokens at all - not authenticated
  if (!authToken && !refreshToken) {
    return NextResponse.json({ authenticated: false });
  }

  // If we have an auth token, validate it by calling the backend
  if (authToken) {
    try {
      // Forward both cookies to the backend
      const cookieHeader = [
        authToken ? `auth_token=${authToken}` : "",
        refreshToken ? `refresh_token=${refreshToken}` : "",
      ]
        .filter(Boolean)
        .join("; ");

      const validateResponse = await fetch(
        `${BACKEND_BASE_URL}/api/User/profile`,
        {
          method: "GET",
          headers: {
            Cookie: cookieHeader,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("Auth check - Profile validation status:", validateResponse.status);

      if (validateResponse.ok) {
        // Token is valid
        return NextResponse.json({ authenticated: true });
      }
    } catch (error) {
      console.error("Token validation error:", error);
    }
  }

  // Auth token is expired or missing, try to refresh
  if (refreshToken) {
    console.log("Auth check - Attempting token refresh...");
    try {
      const refreshResponse = await fetch(
        `${BACKEND_BASE_URL}/api/User/refresh`,
        {
          method: "POST",
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("Auth check - Refresh response status:", refreshResponse.status);

      if (refreshResponse.ok) {
        // Token refreshed successfully
        // Forward the Set-Cookie headers from the refresh response to the client
        const response = NextResponse.json({ authenticated: true });

        // Get all Set-Cookie headers from the refresh response
        const setCookieHeaders = refreshResponse.headers.getSetCookie();
        console.log("Auth check - Set-Cookie headers from refresh:", setCookieHeaders.length);
        setCookieHeaders.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });

        return response;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  }

  // Both validation and refresh failed
  console.log("Auth check - Both validation and refresh failed, returning unauthenticated");
  return NextResponse.json({ authenticated: false });
}
