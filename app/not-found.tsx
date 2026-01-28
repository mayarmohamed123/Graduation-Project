"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { medicalErrorImage } from "@/assets";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Illustration */}
        <div className="relative w-full aspect-square max-w-[300px] mx-auto">
          <Image
            src={medicalErrorImage}
            alt="404 Not Found"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">Oops! Page Not Found</h1>
          <p className="text-[#4D4D4D] text-lg">
            We couldn&apos;t find the medical records (or page) you were looking for.
            It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <Button className="rounded-full px-8 py-6 text-lg">
              Back to Home
            </Button>
          </Link>
          <Button 
             variant="outline" 
             className="rounded-full px-8 py-6 text-lg border-primary text-primary hover:bg-primary/5 transition-all"
             onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
