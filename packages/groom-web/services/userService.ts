import { fetchAPI } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles?: string[];
  bio?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message: string;
}

class UserService {
  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return fetchAPI("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await fetchAPI("/api/auth/logout", {
      method: "POST",
    });
  }

  async getProfile(): Promise<{ user: User }> {
    return fetchAPI("/api/user/profile", { cache: "no-store" });
  }

  // OAuth
  getGoogleAuthUrl(): string {
    const baseURL =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        : "";
    // Note: The backend handles the redirect to Google
    return `${baseURL}/api/auth/google/start`;
  }
}

export default new UserService();
