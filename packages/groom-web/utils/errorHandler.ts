import { toast } from "react-toastify";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Parse error response from API
 */
export function parseApiError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    // Check if it's an API error message
    const message = error.message;

    // Extract status code from "API Error: 401 - message" format
    const match = message.match(/API Error: (\d+) - (.+)/);
    if (match) {
      const statusCode = parseInt(match[1], 10);
      const errorMessage = match[2];
      return new APIError(statusCode, errorMessage, error);
    }

    return new APIError(500, message, error);
  }

  return new APIError(500, "An unexpected error occurred", undefined);
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessage(error: APIError): string {
  switch (error.statusCode) {
    case 400:
      return error.message || "Invalid input. Please check your details.";
    case 401:
      return error.message || "Please log in to continue.";
    case 403:
      return error.message || "You don't have permission to do this.";
    case 404:
      return error.message || "The requested resource was not found.";
    case 409:
      return error.message || "This resource already exists.";
    case 422:
      return error.message || "Invalid data provided.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return error.message || "Server error. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return error.message || "An error occurred. Please try again.";
  }
}

/**
 * Show error toast notification
 */
export function showErrorToast(error: unknown) {
  const apiError = parseApiError(error);
  const message = getErrorMessage(apiError);
  toast.error(message);
  return apiError;
}

/**
 * Handle async operations with error handling
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options?: {
    onError?: (error: APIError) => void;
    showToast?: boolean;
  }
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const apiError = parseApiError(error);

    if (options?.showToast !== false) {
      showErrorToast(apiError);
    }

    options?.onError?.(apiError);
    return null;
  }
}

/**
 * Validate API response structure
 */
export function validateResponse<T>(
  data: unknown,
  expectedKeys?: string[]
): data is T {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (expectedKeys) {
    return expectedKeys.every((key) => key in (data as object));
  }

  return true;
}
