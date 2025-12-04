"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserData } from "@/store/slices/userSlice";
import { useAuthToken } from "./useAuthToken";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.user);
  const { token, isAuthenticated } = useAuthToken();

  useEffect(() => {
    const loadUserData = async () => {
      if (token && !user) {
        try {
          await dispatch(fetchUserData(token)).unwrap();
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      }
    };

    loadUserData();
  }, [dispatch, token, user]);

  const refetchUser = useCallback(async () => {
    if (token) {
      try {
        await dispatch(fetchUserData(token)).unwrap();
      } catch (error) {
        console.error("Failed to refetch user data:", error);
      }
    }
  }, [dispatch, token]);

  return {
    user,
    isLoading: isLoading || false,
    error,
    refetchUser,
    isAuthenticated: !!user && isAuthenticated,
  };
};
