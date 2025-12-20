"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, logoutUser, registerUser } from "@/store/slices/userSlice";
import type { RegisterCredentials } from "@/Services/authService";

// Deprecated: Auth state is now managed by Redux. 
// This component is kept temporarily to avoid breaking layout imports during migration,
// but it just renders children.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);

  const handleRedirect = (user: { roles: string | string[] }) => {
      console.log("🚀 handleRedirect: User roles:", user.roles);
      const roles = user.roles;
      const role = Array.isArray(roles) ? roles[0] : roles;
      const normalizedRole = role?.toLowerCase();
      
      console.log("🚀 handleRedirect: Normalized role:", normalizedRole);

      let targetPath = "/user";
      if (normalizedRole === "doctor") {
        targetPath = "/doctor";
      } else if (normalizedRole === "pharmacy") {
        targetPath = "/pharmacy";
      } else if (normalizedRole === "admin") {
        targetPath = "/admin";
      }

      console.log("🚀 handleRedirect: Redirecting to:", targetPath);
      
      // Use window.location.href for a full reload to ensure cookies are picked up by middleware
      if (typeof window !== "undefined") {
        window.location.href = targetPath;
      }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("🚀 login: Attempting login for:", email);
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log("🚀 login: Success! Result:", result);
      handleRedirect(result.user);
    } catch (error) {
      console.error("🚀 login: Redirect error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterCredentials) => {
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      handleRedirect(result.user);
    } catch (error) {
       console.error("Register redirect error:", error);
       throw error;
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
