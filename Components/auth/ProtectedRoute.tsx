"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            // Redirect to login with callback URL
            const callbackUrl = encodeURIComponent(pathname);
            router.replace(`/login?callbackUrl=${callbackUrl}`);
          }
        } else {
          // If check fails, redirect to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
