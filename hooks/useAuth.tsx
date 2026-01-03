"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, logoutUser, registerUser } from "@/store/slices/userSlice";
import type { RegisterCredentials } from "@/Services/authService";

// Auth context to share auth state across components
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  recheckAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  recheckAuth: async () => {},
});

// Provider component that checks auth via API
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, recheckAuth: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, error } = useAppSelector((state) => state.user);
  
  // Get auth state from context (API-based) instead of Redux
  const { isAuthenticated, isLoading, recheckAuth } = useContext(AuthContext);

  const handleRedirect = (user: { roles: string | string[] }) => {
    console.log("🚀 handleRedirect: User roles:", user.roles);
    const roles = user.roles;
    const role = Array.isArray(roles) ? roles[0] : roles;
    const normalizedRole = role?.toLowerCase();

    console.log("🚀 handleRedirect: Normalized role:", normalizedRole);

    let targetPath = "/user";
    if (normalizedRole === "doctor") {
      targetPath = "/doctor";
    } else if (normalizedRole === "pharmacist") {
      targetPath = "/pharmacy";
    } else if (normalizedRole === "admin") {
      targetPath = "/admin";
    }

    console.log("🚀 handleRedirect: Redirecting to:", targetPath);

    // Use router.push to maintain client-side state and prevent cookie timing issues
    router.push(targetPath);
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("🚀 login: Attempting login for:", email);
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log("🚀 login: Success! Result:", result);
      // Redirect immediately - ProtectedRoute will handle auth check
      handleRedirect(result.user);
    } catch (error) {
      console.error("🚀 login: Error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterCredentials) => {
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      // Recheck auth after register to update context
      await recheckAuth();
      handleRedirect(result.user);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    recheckAuth,
  };
}
