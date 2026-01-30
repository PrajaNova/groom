import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
);

export interface SessionPayload {
  userId: string;
  username: string;
  role: string;
  email?: string;
  avatar?: string;
  [key: string]: unknown;
}

// Client-side utils should NOT have direct DB access or secret keys ideally if used in Client Components.
// But this file seems to be used in Server Actions/Components mostly given 'next/headers'.

/**
 * Get current session from cookies
 * This is effectively verifying the token.
 * In a pure microservice architecture, we might forward the token to user-ms /me to verify.
 * For performance, decentralized verification (sharing secret) is common.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      role: payload.role as string,
      email: payload.email as string,
      avatar: payload.avatar as string,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
