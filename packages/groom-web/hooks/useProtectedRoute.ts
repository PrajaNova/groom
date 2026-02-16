import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface UseProtectedRouteOptions {
  requiredRoles?: string[];
  redirectTo?: string;
}

/**
 * Hook to protect routes with authentication
 * Redirects to login if not authenticated
 * Optionally checks for required roles
 */
export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { requiredRoles, redirectTo = "/login" } = options;

  const isAuthorized = useCallback(() => {
    if (!user) {
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      return requiredRoles.some((role) => user.roles?.includes(role));
    }

    return true;
  }, [user, requiredRoles]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthorized()) {
        const params = new URLSearchParams();
        params.set("redirect", window.location.pathname);
        router.push(`${redirectTo}?${params.toString()}`);
      }
    }
  }, [isLoading, isAuthorized, router, redirectTo]);

  return {
    isLoading,
    isAuthorized: isAuthorized(),
    user,
  };
}

/**
 * Hook to check if user has specific roles
 */
export function useHasRole(roles: string | string[]) {
  const { user } = useAuth();
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return roleArray.some((role) => user?.roles?.includes(role));
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  return useHasRole("ADMIN");
}
