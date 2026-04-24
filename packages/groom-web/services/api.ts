// Universal API client using native fetch
// Works in both Client and Server Components

const isServer = typeof window === "undefined";

const getBaseURL = () => {
  if (isServer) {
    // Server-side: use backend API directly
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
  }
  // Client-side: use relative URLs (goes through Next.js server)
  return "";
};

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${getBaseURL()}${endpoint}`;

  // Add query parameters if provided
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Only set Content-Type: application/json if there's a body and it's not already set
  if (fetchOptions.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include", // Important for session cookies
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}
