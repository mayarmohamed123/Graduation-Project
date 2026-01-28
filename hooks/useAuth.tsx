"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, logoutUser, registerUser } from "@/store/slices/userSlice";
import { store } from "@/store/store";
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

  const handleRedirect = async () => {
    // Wait for user data to be available in Redux (with timeout)
    const maxAttempts = 20; // Increased attempts
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      // Get fresh user data directly from Redux store, not from closure
      const currentUser = store.getState().user.user;
      
      console.log(`[handleRedirect] Attempt ${attempts + 1}: User data:`, currentUser ? {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        roles: currentUser.roles
      } : 'null');
      
      if (currentUser) {
        // Get user's role (prefer role field from profile, fallback to roles array from login)
        const userRole = currentUser.role || 
          (Array.isArray(currentUser.roles) && currentUser.roles.length > 0 
            ? currentUser.roles[0] 
            : (typeof currentUser.roles === 'string' ? currentUser.roles : null));

        console.log(`[handleRedirect] Extracted role:`, userRole);

        if (userRole) {
          // Normalize role to match UserRole type (case-sensitive)
          let normalizedRole: string = userRole;
          if (typeof userRole === 'string') {
            // Handle different case formats - check if already correct first
            if (userRole === "Admin" || userRole === "Doctor" || userRole === "Pharmacist" || userRole === "RegularUser") {
              // Already in correct format
              normalizedRole = userRole;
            } else {
              // Normalize based on lowercase comparison
              const lowerRole = userRole.toLowerCase().trim();
              if (lowerRole === "admin") {
                normalizedRole = "Admin";
              } else if (lowerRole === "doctor") {
                normalizedRole = "Doctor";
              } else if (lowerRole === "pharmacist") {
                normalizedRole = "Pharmacist";
              } else if (lowerRole === "regularuser" || lowerRole === "regular user") {
                normalizedRole = "RegularUser";
              } else {
                // Fallback: try to capitalize properly
                normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
                console.warn(`[handleRedirect] Unknown role format: "${userRole}", normalized to: "${normalizedRole}"`);
              }
            }
          }

          let targetPath = "/user";
          if (normalizedRole === "Admin") {
            targetPath = "/admin";
          } else if (normalizedRole === "Doctor") {
            targetPath = "/doctor";
          } else if (normalizedRole === "Pharmacist") {
            targetPath = "/pharmacy";
          } else if (normalizedRole === "RegularUser") {
            targetPath = "/user";
          }

          console.log("🚀 handleRedirect: User role:", normalizedRole, "→ Redirecting to:", targetPath);
          router.push(targetPath);
          return;
        }
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 150));
      attempts++;
    }
    
    // Fallback if user data never loads
    console.warn("handleRedirect: User data not available after waiting, defaulting to /user");
    router.push("/user");
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("🚀 login: Attempting login for:", email);
      await dispatch(loginUser({ email, password })).unwrap();
      console.log("🚀 login: Success! Waiting for user profile...");
      
      // Give a small delay to ensure fetchUserData completes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await recheckAuth();
      // Wait for fetchUserData to complete and update Redux state
      // The loginUser thunk already calls fetchUserData, so user should be in Redux
      await handleRedirect();
    } catch (error) {
      console.error("🚀 login: Error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterCredentials) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      // Give a small delay to ensure fetchUserData completes
      await new Promise(resolve => setTimeout(resolve, 300));
      // Recheck auth after register to update context
      await recheckAuth();
      // Wait for fetchUserData to complete
      await handleRedirect();
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
