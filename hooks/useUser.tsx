"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/Services/authService";
import { useCallback } from "react";

export const useUser = () => {
  const queryClient = useQueryClient();
  
  // Check if auth token exists on client-side to avoid unnecessary API calls on public pages
  const hasAuthToken = typeof window !== "undefined" 
    ? document.cookie.includes("auth_token") || document.cookie.includes("refresh_token")
    : false; // On server-side, don't fetch in the hook

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: hasAuthToken, // Only fetch if auth cookies exist
  });

  const refetchUser = useCallback(async () => {
    return await refetch();
  }, [refetch]);

  const clearUserData = useCallback(() => {
    queryClient.setQueryData(["user-profile"], null);
  }, [queryClient]);

  return {
    user,
    isLoading,
    error,
    refetchUser,
    clearUserData,
    isAuthenticated: !!user,
  };
};
