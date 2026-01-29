import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_PATHS: Record<string, string> = {
  Admin: "/admin",
  Doctor: "/doctor",
  Pharmacist: "/pharmacy",
  RegularUser: "/user",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for tokens
  const authToken = request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  
  const isAuth = !!authToken;

  // 1. Redirect authenticated users away from auth paths
  const authPaths = ["/login", "/register"];
  if (isAuth && authPaths.some(p => pathname.startsWith(p))) {
    const target = ROLE_PATHS[userRole || "RegularUser"] || "/user";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. Protect dashboard paths
  const protectedPaths = ["/admin", "/doctor", "/pharmacy", "/user"];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtectedPath) {
    if (!isAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Role enforcement (simple path-based)
    if (pathname.startsWith("/admin") && userRole !== "Admin") {
      return NextResponse.redirect(new URL(ROLE_PATHS[userRole || "RegularUser"] || "/user", request.url));
    }
    if (pathname.startsWith("/doctor") && userRole !== "Doctor") {
      return NextResponse.redirect(new URL(ROLE_PATHS[userRole || "RegularUser"] || "/user", request.url));
    }
    if (pathname.startsWith("/pharmacy") && userRole !== "Pharmacist") {
      return NextResponse.redirect(new URL(ROLE_PATHS[userRole || "RegularUser"] || "/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/doctor/:path*",
    "/pharmacy/:path*",
    "/user/:path*",
    "/login",
    "/register/:path*",
  ],
};
