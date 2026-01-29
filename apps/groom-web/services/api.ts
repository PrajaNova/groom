// Universal API client using native fetch
// Works in both Client and Server Components

const isServer = typeof window === "undefined";

const getBaseURL = () => {
  if (isServer) {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
  return ""; // Client-side uses relative URLs
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

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include", // Important for session cookies
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}
