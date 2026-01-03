import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  // Check for auth tokens in cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // No tokens at all - not authenticated
  if (authToken && refreshToken) {
    return NextResponse.json({ authenticated: true });
  }

  // Both validation and refresh failed
  return NextResponse.json({ authenticated: false });
}
