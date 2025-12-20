"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the full response from URL hash or search params
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash || window.location.search);

        // Try to get data from multiple sources
        let token = params.get("token") || searchParams.get("token");
        let userDataStr = params.get("user") || searchParams.get("user");

        // Try to get response object directly
        const responseStr = params.get("response") || searchParams.get("response");
        if (responseStr) {
          const data = JSON.parse(decodeURIComponent(responseStr));
          token = data.token;
          userDataStr = JSON.stringify(data.user);
        }

        // Check if we have the data
        if (!token && !userDataStr) {
          // If no data in URL, check if we were redirected from google-response
          // The backend might have sent us here without params
          toast.error("Authentication data not found. Please try again.");
          router.push("/login");
          return;
        }

        if (userDataStr) {
          // Parse user data
          const user = typeof userDataStr === "string" ? JSON.parse(userDataStr) : userDataStr;

          toast.success(`Welcome back, ${user.userName}!`);

          // Navigate based on role
          const roles = Array.isArray(user.roles) ? user.roles : [user.roles];

          if (roles.includes("Admin")) {
            router.push("/admin");
          } else if (roles.includes("Doctor")) {
            router.push("/doctor");
          } else if (roles.includes("RegularUser") || roles.includes("User")) {
            router.push("/user");
          } else {
            // Default to user dashboard
            router.push("/user");
          }
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication failed");
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
