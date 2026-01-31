"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/Services/authService";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get user data from URL params
        const userStr = searchParams.get("user");
        
        if (userStr) {
          try {
            const user = JSON.parse(decodeURIComponent(userStr));
            toast.success(`Welcome back, ${user.UserName || user.userName || 'User'}!`);
          } catch (e) {
            console.error("Failed to parse user data from URL", e);
          }
        }

        // Verify session (HttpOnly cookie should be set by backend)
        await authService.getProfile();
        
        // Redirect to user dashboard (social login is for regular users only)
        router.push("/user");
        
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        router.push("/login");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D5F4F6]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BBBC5] mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#D5F4F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BBBC5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
