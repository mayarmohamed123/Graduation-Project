import { NextRequest, NextResponse } from "next/server";

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
      const validateResponse = await fetch(
        `${BACKEND_BASE_URL}/api/User/profile`,
        {
          method: "GET",
          headers: {
            Cookie: `auth_token=${authToken}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

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

      if (refreshResponse.ok) {
        // Token refreshed successfully
        // Forward the Set-Cookie headers from the refresh response to the client
        const response = NextResponse.json({ authenticated: true });

        // Get all Set-Cookie headers from the refresh response
        const setCookieHeaders = refreshResponse.headers.getSetCookie();
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
  return NextResponse.json({ authenticated: false });
}
