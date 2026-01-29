"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type React from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Always try to fetch current user from backend on page load
      // This verifies the session cookie and gets latest user data
      try {
        const res = await fetch("/api/user/profile", {
          credentials: "include", // Always send cookies
        });

        if (res.ok) {
          const data = await res.json();
          console.log("User authenticated:", data);
          setUser(data);
          setSessionToken("cookie-based");
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("sessionToken", "cookie-based");
        } else {
          console.log("No active session, user logged out");
          // Clear any stale data
          setUser(null);
          setSessionToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("sessionToken");
        }
      } catch (error) {
        console.error("Failed to verify session:", error);
        // Clear on error
        setUser(null);
        setSessionToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("sessionToken");
      }

      setIsLoading(false);

      // Clean up URL if coming from OAuth
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "success") {
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setSessionToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionToken", token);
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, sessionToken, login, logout, isLoading }}
    >
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
