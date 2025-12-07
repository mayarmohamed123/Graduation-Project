"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { authService } from "@/services/authService";

export const useAuthToken = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Sync NextAuth session token with cookie
    if (session?.accessToken) {
      authService.setToken(session.accessToken);
    }
  }, [session?.accessToken]);

  // Derive authentication state from session status
  const isAuthenticated = status === "authenticated" && !!session?.accessToken;

  return {
    isAuthenticated,
    isLoading: status === "loading",
    token: session?.accessToken || authService.getToken(),
  };
};
