import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check for tokens in cookies
  const authToken = request.cookies.get("auth_token")?.value;

  const isAuth = authToken;

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
    "/login",
    "/register/:path*",
  ],
};
