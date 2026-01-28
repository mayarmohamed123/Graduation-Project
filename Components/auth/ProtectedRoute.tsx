"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUserData } from "@/store/slices/userSlice";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Optional: specify which roles can access this route
}

/**
 * Maps user roles to their main dashboard paths
 */
const getRoleMainPath = (role: UserRole | undefined): string => {
  switch (role) {
    case "Admin":
      return "/admin";
    case "Doctor":
      return "/doctor";
    case "Pharmacist":
      return "/pharmacy";
    case "RegularUser":
    default:
      return "/user";
  }
};

/**
 * Determines the required role based on the current pathname
 */
const getRequiredRoleFromPath = (pathname: string): UserRole | null => {
  if (pathname.startsWith("/admin")) {
    return "Admin";
  }
  if (pathname.startsWith("/doctor")) {
    return "Doctor";
  }
  if (pathname.startsWith("/pharmacy")) {
    return "Pharmacist";
  }
  if (pathname.startsWith("/user")) {
    return "RegularUser";
  }
  return null; // Public route or unknown
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedRole, setHasCheckedRole] = useState(false);

  // First effect: Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          return;
        }

        const data = await response.json();
        
        if (!data.authenticated) {
          router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          return;
        }

        setIsAuthenticated(true);

        // Always fetch user profile to ensure we have the latest role
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router, dispatch]);

  // Second effect: Check role-based access once user is available
  useEffect(() => {
    if (!isAuthenticated || isChecking || hasCheckedRole || !user) {
      return;
    }

    // Get user's role (prefer role field, fallback to roles array)
    let userRole: UserRole | undefined = user.role;
    
    if (!userRole && user.roles) {
      if (Array.isArray(user.roles) && user.roles.length > 0) {
        // Normalize the role from array
        const roleStr = user.roles[0];
        userRole = roleStr as UserRole;
      } else if (typeof user.roles === 'string') {
        userRole = user.roles as UserRole;
      }
    }

    if (!userRole) {
      // Role not available yet, wait
      return;
    }

    // Normalize role to ensure proper case matching
    const normalizeRole = (role: string): UserRole => {
      const normalized = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      if (normalized === "Regularuser") return "RegularUser";
      if (normalized === "Admin" || normalized === "Doctor" || normalized === "Pharmacist" || normalized === "RegularUser") {
        return normalized as UserRole;
      }
      return "RegularUser"; // Default fallback
    };

    const normalizedUserRole = normalizeRole(userRole);

    // Determine required role from pathname
    const requiredRole = allowedRoles 
      ? null // If allowedRoles is specified, use that instead
      : getRequiredRoleFromPath(pathname);

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
      // If allowedRoles is specified, check if user's role is in the list
      if (!allowedRoles.includes(normalizedUserRole)) {
        const mainPath = getRoleMainPath(normalizedUserRole);
        // Only redirect if not already on the target path (prevent loops)
        if (pathname !== mainPath && !pathname.startsWith(mainPath + "/")) {
          console.log(`[ProtectedRoute] User role ${normalizedUserRole} not in allowedRoles, redirecting to ${mainPath}`);
          router.replace(mainPath);
        }
        setHasCheckedRole(true);
        return;
      }
    } else if (requiredRole) {
      // If no allowedRoles specified, check based on pathname
      if (normalizedUserRole !== requiredRole) {
        // User doesn't have the required role, redirect to their main page
        const mainPath = getRoleMainPath(normalizedUserRole);
        // Only redirect if not already on the target path (prevent loops)
        if (pathname !== mainPath && !pathname.startsWith(mainPath + "/")) {
          console.log(`[ProtectedRoute] User role ${normalizedUserRole} doesn't match required ${requiredRole}, redirecting to ${mainPath}`);
          router.replace(mainPath);
        }
        setHasCheckedRole(true);
        return;
      }
    }

    setHasCheckedRole(true);
  }, [isAuthenticated, isChecking, user, pathname, router, allowedRoles, hasCheckedRole]);

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
