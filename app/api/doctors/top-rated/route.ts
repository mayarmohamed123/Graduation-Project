import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export const revalidate = 1800; // cache for 30 minutes

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/doctors/top-doctors`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch top rated doctors." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      Array.isArray(data) ? data : [],
      response.status === 200 ? { status: 200 } : undefined
    );
  } catch (error) {
    console.error("Top rated doctors route error:", error);
    return NextResponse.json(
      { message: "Unexpected error fetching top rated doctors." },
      { status: 500 }
    );
  }
}

