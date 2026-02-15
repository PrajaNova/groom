import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export async function fetchServer<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(session ? { Cookie: `session=${session.value}` } : {}),
    ...(init?.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    headers,
    cache: init?.cache || "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
