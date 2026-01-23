"use client";

import { Button } from "@/Components/ui";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-8">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-6xl font-bold text-red-600">500</h1>
            <h2 className="text-3xl font-semibold text-gray-900 leading-tight">
              Critical System Failure
            </h2>
            <p className="text-gray-600 text-lg">
              A critical error occurred in the application root. Our specialized team has been notified.
            </p>
            {error.digest && (
              <p className="font-mono text-sm bg-gray-100 p-2 rounded text-gray-500 mt-4">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button
              onClick={() => reset()}
              className="w-full py-6 text-lg rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Recover System
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full py-6 text-lg rounded-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
            >
              Forced Home Redirect
            </Button>
          </div>

          <div className="pt-8 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Sehaa Healthcare. High-priority maintenance mode active.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
