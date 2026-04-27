"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import userService, { type User } from "@/services/userService";

interface AuthContextType {
  user: User | null;
  login: (userData: User, token?: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Clean up URL and extract token if coming from OAuth
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        
        if (urlToken) {
          localStorage.setItem("auth_token", urlToken);
          // Remove token and auth from URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        } else if (params.get("auth") === "success") {
          window.history.replaceState({}, "", window.location.pathname);
        }
      }

      try {
        const { user } = await userService.getProfile();
        setUser(user);
      } catch (_error) {
        console.log("No active session or session expired");
        // If profile check fails, we might want to clear a potentially invalid token
        if (typeof window !== "undefined") {
          // localStorage.removeItem("auth_token"); // Be careful not to clear it too aggressively if it was just set
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User, token?: string) => {
    if (token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
