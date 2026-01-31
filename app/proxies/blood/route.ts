import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = "https://healing-api.ngrok.app/api/BloodRequest/unfulfilled";

  try {
    const response = await fetch(API_URL, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from backend" },
      { status: 500 },
    );
  }
}
