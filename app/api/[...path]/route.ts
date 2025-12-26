import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The real backend URL from your logs
const REAL_BACKEND_URL = "https://unendingly-unfoul-emmy.ngrok-free.dev/api";

async function proxyRequest(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api", "");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${REAL_BACKEND_URL}${path}${searchParams ? "?" + searchParams : ""}`;

  console.log(`[Proxy] Forwarding to: ${url}`);

  const requestHeaders = new Headers(request.headers);
  // Ensure we tell ngrok to skip its warning page
  requestHeaders.set("ngrok-skip-browser-warning", "true");
  
  // Remove host header to avoid conflicts
  requestHeaders.delete("host");

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: requestHeaders,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.blob() : undefined,
      cache: "no-store",
      // IMPORTANT: We tell fetch NOT to follow redirects automatically if we want to handle them
      // but usually for API it's fine. 
      // credentials: "omit" because the server (Next.js) doesn't have the cookies yet, 
      // the request from the browser ALREADY has them and we are just forwarding those headers.
    });

    // Create a new response with the same status
    const proxyResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy all headers from the backend response
    response.headers.forEach((value, key) => {
      // Special handling for Set-Cookie to fix domain issues
      if (key.toLowerCase() === "set-cookie") {
        // We might have multiple Set-Cookie headers
        const cookies = response.headers.getSetCookie();
        cookies.forEach(cookie => {
          // Remove the Domain attribute so the browser saves it for localhost
          const cleanedCookie = cookie.replace(/Domain=[^;]+;?/gi, "");
          proxyResponse.headers.append("Set-Cookie", cleanedCookie);
        });
      } else {
        proxyResponse.headers.set(key, value);
      }
    });

    return proxyResponse;
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json({ message: "Proxy error", error: String(error) }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
