"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/Services/authService";
import { useCallback } from "react";

export const useUser = () => {
  const queryClient = useQueryClient();

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
