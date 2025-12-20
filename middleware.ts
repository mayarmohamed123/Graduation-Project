import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check for tokens in cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isAuth = authToken || refreshToken;

  console.log(`[Middleware] Path: ${path}, isAuth: ${!!isAuth}`);
  if (isAuth) {
    console.log(
      `[Middleware] Tokens found: auth_token: ${!!authToken}, refresh_token: ${!!refreshToken}`
    );
  }

  // Protected routes
  const protectedPaths = ["/user", "/doctor", "/admin"];
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  // If accessing protected routes without tokens, redirect to login
  if (isProtectedPath && !isAuth) {
    console.log(`[Middleware] Unauthorized access to ${path}, redirecting to /login`);
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // If already authenticated and trying to access login/register, redirect to dashboard
  const authPaths = ["/login", "/register"];
  if (isAuth && authPaths.some((p) => path.startsWith(p))) {
    console.log(`[Middleware] Authenticated user at ${path}, redirecting to /user`);
    return NextResponse.redirect(new URL("/user", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/login",
    "/register/:path*",
  ],
};
