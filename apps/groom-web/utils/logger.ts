/**
 * Simple logger utility with environment-aware logging
 */

type LogLevel = "info" | "warn" | "error" | "debug";

const isDev = process.env.NODE_ENV === "development";
const isVerbose = process.env.NEXT_PUBLIC_VERBOSE_LOGS === "true";

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const emoji = this.getEmoji(level);
    return `${emoji} [${timestamp}] [${this.context}] ${message}`;
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case "info":
        return "ℹ️";
      case "warn":
        return "⚠️";
      case "error":
        return "❌";
      case "debug":
        return "🐛";
      default:
        return "📝";
    }
  }

  private shouldLog(level: LogLevel): boolean {
    // Always log errors
    if (level === "error") return true;

    // In production, only log errors and warnings
    if (!isDev && level === "debug") return false;

    // Log info only if verbose mode is enabled or in dev
    if (level === "info" && !isDev && !isVerbose) return false;

    return true;
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message), ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message), ...args);
    }
  }

  // API-specific helpers
  apiRequest(method: string, path: string): void {
    this.info(`📥 ${method} ${path} - Request received`);
  }

  apiSuccess(
    method: string,
    path: string,
    duration: number,
    details?: string,
  ): void {
    this.info(
      `✅ ${method} ${path} - Success (${duration}ms)${details ? ` - ${details}` : ""}`,
    );
  }

  apiError(
    method: string,
    path: string,
    duration: number,
    error: unknown,
  ): void {
    this.error(`❌ ${method} ${path} - Error (${duration}ms)`, error);
  }

  apiNotFound(method: string, path: string, duration: number): void {
    this.warn(`⚠️  ${method} ${path} - Not found (${duration}ms)`);
  }
}

// Export logger factory
export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Export default loggers for common contexts
export const apiLogger = createLogger("API");
export const serviceLogger = createLogger("Service");
export const dbLogger = createLogger("Database");

export default Logger;
