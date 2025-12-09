"use client";

import { useAuth } from "@/lib/auth";

export const useAuthToken = () => {
  const { token, isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    token,
  };
};
