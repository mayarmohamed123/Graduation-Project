"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginUser, logoutUser, registerUser } from "@/store/slices/userSlice";
import type { User } from "@/types";
import type { RegisterCredentials } from "@/Services/authService";
import { useUser } from "./useUser";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading, error, refetchUser, clearUserData } = useUser();

  const redirectBasedOnUser = useCallback((user: User | null) => {
    if (!user) return;

    const userRole = user.role || 
      (Array.isArray(user.roles) && user.roles.length > 0 
        ? user.roles[0] 
        : (typeof user.roles === 'string' ? user.roles : null));

    if (!userRole) return;

    let normalizedRole: string = userRole;
    const validRoles = ["Admin", "Doctor", "Pharmacist", "RegularUser"];
    
    if (!validRoles.includes(userRole)) {
      const lowerRole = userRole.toLowerCase().trim();
      if (lowerRole === "admin") normalizedRole = "Admin";
      else if (lowerRole === "doctor") normalizedRole = "Doctor";
      else if (lowerRole === "pharmacist") normalizedRole = "Pharmacist";
      else if (lowerRole === "regularuser" || lowerRole === "regular user") normalizedRole = "RegularUser";
      else {
        normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
      }
    }

    const rolePaths: Record<string, string> = {
      Admin: "/admin",
      Doctor: "/doctor",
      Pharmacist: "/pharmacy",
      RegularUser: "/user",
    };

    const targetPath = rolePaths[normalizedRole] || "/user";
    router.push(targetPath);
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      const { data: currentUser } = await refetchUser();
      if (currentUser) {
        redirectBasedOnUser(currentUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterCredentials) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      const { data: currentUser } = await refetchUser();
      if (currentUser) {
        redirectBasedOnUser(currentUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
    clearUserData();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
