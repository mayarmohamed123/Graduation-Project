"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserData } from "@/store/slices/userSlice";
import { useAuthToken } from "./useAuthToken";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.user);
  const { token, isAuthenticated } = useAuthToken();

  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && token && !user) {
        try {
          await dispatch(fetchUserData(token)).unwrap();
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      }
    };

    loadUserData();
  }, [dispatch, isAuthenticated, token, user]);

  const refetchUser = async () => {
    if (token) {
      try {
        await dispatch(fetchUserData(token)).unwrap();
      } catch (error) {
        console.error("Failed to refetch user data:", error);
      }
    }
  };

  return {
    user,
    isLoading: isLoading || false,
    error,
    refetchUser,
    isAuthenticated: !!user && isAuthenticated,
  };
};
