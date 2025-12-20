"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserData } from "@/store/slices/userSlice";
import { useAuth } from "@/hooks/useAuth";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.user);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && !user) {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      }
    };

    loadUserData();
  }, [dispatch, isAuthenticated, user]);

  const refetchUser = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await dispatch(fetchUserData()).unwrap();
      } catch (error) {
        console.error("Failed to refetch user data:", error);
      }
    }
  }, [dispatch, isAuthenticated]);

  return {
    user,
    isLoading: isLoading || false,
    error,
    refetchUser,
    isAuthenticated: !!user && isAuthenticated,
  };
};
