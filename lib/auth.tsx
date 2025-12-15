"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService, AuthResponse, RegisterResponse } from "@/Services/authService";
import toast from "react-hot-toast";

interface User {
  userName: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    phonenumber: string;
    address: string;
    password: string;
    confirmpassword: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from token on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        setToken(storedToken);
        // Try to decode user info from token or fetch from API
        // For now, we'll just mark as authenticated
        // You may want to add a API call to verify token and get user info
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login({ email, password });
      
      // Store token
      authService.setToken(response.token);
      setToken(response.token);

      // Normalize roles
      const roles = Array.isArray(response.user.roles) 
        ? response.user.roles 
        : [response.user.roles];

      // Set user
      setUser({
        userName: response.user.userName,
        email: response.user.email,
        roles,
      });

      toast.success("Login successful!");
      router.push("/user");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    phonenumber: string;
    address: string;
    password: string;
    confirmpassword: string;
    role: string;
  }) => {
    try {
      const response: RegisterResponse = await authService.register(data);

      toast.success("Registration successful!");
      
      // Auto-login after registration
      await login(data.email, data.password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
