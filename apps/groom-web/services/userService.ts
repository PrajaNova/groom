import { fetchAPI } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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

class UserService {
  // Auth methods
  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    return fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
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

  async getProfile(): Promise<User> {
    return fetchAPI("/api/auth/me", { cache: "no-store" });
  }

  // OAuth
  getGoogleAuthUrl(): string {
    const baseURL =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        : "";
    return `${baseURL}/api/auth/google`;
  }
}

export default new UserService();
