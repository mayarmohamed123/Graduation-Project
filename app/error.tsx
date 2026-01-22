"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui";
import { medicalErrorImage } from "@/assets";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Illustration */}
        <div className="relative w-full aspect-square max-w-[300px] mx-auto opacity-80">
          <Image
            src={medicalErrorImage}
            alt="Something went wrong"
            fill
            className="object-contain grayscale-[0.2]"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-red-400">System Malfunction</h1>
          <p className="text-[#4D4D4D] text-lg">
            Something went wrong while processing your request. Our medical team (developers) are on it!
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono">Error ID: {error.digest}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => reset()} 
            className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 transition-all font-semibold"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button 
              variant="outline" 
              className="rounded-full px-8 py-6 text-lg border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
            >
              Back to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
