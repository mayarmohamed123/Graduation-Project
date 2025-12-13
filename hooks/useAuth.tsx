"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, logoutUser, registerUser } from "@/store/slices/userSlice";
import type { RegisterCredentials } from "@/services/authService";
import { useRouter } from "next/navigation";

// Deprecated: Auth state is now managed by Redux. 
// This component is kept temporarily to avoid breaking layout imports during migration,
// but it just renders children.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);

  const router = useRouter();

  const handleRedirect = (user: { roles: string | string[] }) => {
      const roles = user.roles;
      const role = Array.isArray(roles) ? roles[0] : roles;

      if (role?.toLowerCase() === "doctor") {
        router.push("/doctor");
      } else if (role?.toLowerCase() === "pharmacy") {
        router.push("/pharmacy");
      } else {
        router.push("/user");
      }
      router.refresh();
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      handleRedirect(result.user);
    } catch (error) {
      console.error("Login redirect error:", error);
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
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
