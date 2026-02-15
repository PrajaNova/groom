// Provider Names
export const PROVIDERS = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  GITHUB: "github",
  DISCORD: "discord",
  LINKEDIN: "linkedin",
  CUSTOM: "custom",
} as const;

// Provider Display Names
export const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  [PROVIDERS.GOOGLE]: "Google",
  [PROVIDERS.FACEBOOK]: "Facebook",
  [PROVIDERS.GITHUB]: "GitHub",
  [PROVIDERS.DISCORD]: "Discord",
  [PROVIDERS.LINKEDIN]: "LinkedIn",
  [PROVIDERS.CUSTOM]: "Custom Provider",
};

// Provider Icons
export const PROVIDER_ICONS: Record<string, string> = {
  [PROVIDERS.GOOGLE]: "google",
  [PROVIDERS.FACEBOOK]: "facebook",
  [PROVIDERS.GITHUB]: "github",
  [PROVIDERS.DISCORD]: "discord",
  [PROVIDERS.LINKEDIN]: "linkedin",
  [PROVIDERS.CUSTOM]: "custom",
};

// API Endpoints
export const API_ENDPOINTS = {
  GOOGLE_USERINFO: "https://www.googleapis.com/oauth2/v2/userinfo",
  GITHUB_USER: "https://api.github.com/user",
  GITHUB_USER_EMAILS: "https://api.github.com/user/emails",
  FACEBOOK_ME: "https://graph.facebook.com/me",
  FACEBOOK_FIELDS: "id,name,email,picture",
  DISCORD_USER: "https://discord.com/api/users/@me",
  DISCORD_CDN_AVATAR: "https://cdn.discordapp.com/avatars",
  LINKEDIN_USERINFO: "https://api.linkedin.com/v2/userinfo",
} as const;

// Route Paths
export const ROUTES = {
  // Auth routes
  AUTH_PROVIDERS: "/auth/providers",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",

  // OAuth callbacks
  GOOGLE_CALLBACK: "/auth/google/callback",
  GITHUB_CALLBACK: "/auth/github/callback",
  FACEBOOK_CALLBACK: "/auth/facebook/callback",
  DISCORD_CALLBACK: "/auth/discord/callback",
  LINKEDIN_CALLBACK: "/auth/linkedin/callback",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // OAuth Errors
  OAUTH_ERROR: "OAuth Error",
  OAUTH_CALLBACK_ERROR: "OAuth callback error",
  MISSING_CODE: "Missing authorization code",
  MISSING_TOKEN: "Missing access token",
  AUTH_FAILED: "Authentication failed",
  AUTH_FAILED_MESSAGE: "Failed to complete authentication",

  // Authentication Errors
  UNAUTHORIZED: "Unauthorized",
  NO_SESSION_TOKEN: "No session token provided",
  INVALID_SESSION_TOKEN: "Invalid session token",
  SESSION_EXPIRED: "Session expired or invalid",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",

  // Registration Errors
  EMAIL_ALREADY_EXISTS: "Email already registered",
  INVALID_EMAIL: "Invalid email format",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  MISSING_REQUIRED_FIELDS: "Missing required fields",
  WEAK_PASSWORD:
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",

  // Session Errors
  SESSION_NOT_FOUND: "Session not found",

  // Booking Errors
  BOOKING_NOT_FOUND: "Booking not found",
  BOOKING_DUPLICATE: "An active booking already exists for this email",
  BOOKING_REQUIRED_FIELDS: "Email, Name, and When are required fields",

  // Content Errors
  BLOG_NOT_FOUND: "Blog not found",
  CONFESSION_NOT_FOUND: "Confession not found",
  TESTIMONIAL_NOT_FOUND: "Testimonial not found",

  // RBAC Errors
  FORBIDDEN: "Insufficient permissions",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH_SUCCESS: "Authentication successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  SESSION_REVOKED: "Session revoked",
  BOOKING_CANCELLED: "Booking cancelled successfully",
  BLOG_DELETED: "Blog deleted successfully",
  CONFESSION_DELETED: "Confession deleted successfully",
  TESTIMONIAL_DELETED: "Testimonial deleted successfully",
} as const;

// Audit Events
export const AUDIT_EVENTS = {
  LOGIN: "login",
  LOGOUT: "logout",
  SESSION_REVOKE: "session_revoke",
  REGISTER: "register",
  LOGIN_FAILED: "login_failed",
} as const;

// Authentication Methods
export const AUTH_METHODS = {
  OAUTH: "oauth",
  LOCAL: "local",
} as const;

// HTTP Headers
export const HTTP_HEADERS = {
  AUTHORIZATION: "Authorization",
  USER_AGENT: "User-Agent",
} as const;

// Cookie Configuration
export const COOKIE_CONFIG = {
  SESSION_NAME: "session",
  PATH: "/",
  SAME_SITE: "lax" as const,
} as const;

// Environment
export const ENV = {
  PRODUCTION: "production",
} as const;

// User Agents
export const USER_AGENT = {
  GITHUB: "groom-backend",
} as const;

// Log Messages
export const LOG_MESSAGES = {
  OAUTH_CALLBACK_RECEIVED: "OAuth callback received",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Service Information
export const SERVICE_INFO = {
  NAME: "groom-backend",
  VERSION: "1.0.0",
  DESCRIPTION: "Groom Backend - Unified API Service for Mental Health Counseling Platform",
} as const;

export const ENDPOINT_DOCS = {
  swagger: "/documentation",
  health: "/health",
  ready: "/ready",
  AUTH_PROVIDERS: "/auth/providers - Lists available OAuth providers",
  AUTH_START: "/auth/:provider/start - Initiates OAuth flow",
  AUTH_CALLBACK: "/auth/:provider/callback - OAuth callback handler",
  AUTH_LOGOUT: "/auth/logout - Logs out current user",
  USER_PROFILE: "/user/profile - Get/update user profile",
  USER_SESSIONS: "/user/sessions - List active sessions",
  USER_REVOKE_SESSION: "/user/sessions/:sessionId - Revoke a session",
  USER_LOGOUT_ALL: "/user/logout-all - Revoke all sessions",
  BOOKINGS: "/bookings - Booking CRUD",
  BLOGS: "/blogs - Blog CMS",
  CONFESSIONS: "/confessions - Anonymous confessions",
  TESTIMONIALS: "/testimonials - Testimonials",
  HEALTH_CHECK: "/health - Service health check",
} as const;

// Health Check Messages
export const HEALTH_MESSAGES = {
  STATUS_OK: "ok",
  STATUS_READY: "ready",
  STATUS_NOT_READY: "not ready",
  DATABASE_CONNECTED: "connected",
  DATABASE_DISCONNECTED: "disconnected",
  READINESS_FAILED: "Readiness check failed",
} as const;

// User Routes (current user context)
export const USER_ROUTES = {
  PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  SESSIONS: "/user/sessions",
  SESSION_BY_ID: "/user/sessions/:sessionId",
  ROLES: "/user/roles",
} as const;

// Users Routes (admin - all users)
export const USERS_ROUTES = {
  LIST: "/users",
  BY_ID: "/users/:id",
  USER_ROLES: "/users/:id/roles",
  USER_ROLE_BY_ID: "/users/:id/roles/:roleId",
} as const;

// Role Routes (admin)
export const ROLE_ROUTES = {
  LIST: "/roles",
  CREATE: "/roles",
  BY_ID: "/roles/:id",
  ASSIGN: "/users/:id/roles",
  REVOKE: "/users/:id/roles/:roleId",
} as const;

// Booking Routes
export const BOOKING_ROUTES = {
  LIST: "/bookings",
  CREATE: "/bookings",
  BY_ID: "/bookings/:id",
  UPDATE: "/bookings/:id",
  DELETE: "/bookings/:id",
} as const;

// Blog Routes
export const BLOG_ROUTES = {
  LIST: "/blogs",
  CREATE: "/blogs",
  BY_SLUG: "/blogs/:slug",
  UPDATE: "/blogs/:slug",
  DELETE: "/blogs/:slug",
} as const;

// Confession Routes
export const CONFESSION_ROUTES = {
  LIST: "/confessions",
  CREATE: "/confessions",
  BY_ID: "/confessions/:id",
  DELETE: "/confessions/:id",
} as const;

// Testimonial Routes
export const TESTIMONIAL_ROUTES = {
  LIST: "/testimonials",
  CREATE: "/testimonials",
  BY_ID: "/testimonials/:id",
  UPDATE: "/testimonials/:id",
  DELETE: "/testimonials/:id",
} as const;

// System Routes
export const SYSTEM_ROUTES = {
  ROOT: "/",
  HEALTH: "/health",
  READY: "/ready",
} as const;

// Misc
export const MISC = {
  BEARER_PREFIX: "Bearer",
  EMPTY_STRING: "",
  SECONDS_PER_HOUR: 3600,
  UNKNOWN: "unknown",
  LOCALHOST: "127.0.0.1",
} as const;

// OAuth Plugin Names
export const OAUTH_PLUGIN_NAMES = {
  GOOGLE: "googleOAuth2",
  FACEBOOK: "facebookOAuth2",
  GITHUB: "githubOAuth2",
  DISCORD: "discordOAuth2",
  LINKEDIN: "linkedinOAuth2",
} as const;

// OAuth Start Redirect Paths
export const OAUTH_START_PATHS = {
  GOOGLE: "/api/auth/google/start",
  FACEBOOK: "/api/auth/facebook/start",
  GITHUB: "/api/auth/github/start",
  DISCORD: "/api/auth/discord/start",
  LINKEDIN: "/api/auth/linkedin/start",
} as const;

// Discord OAuth Configuration
export const DISCORD_OAUTH_CONFIG = {
  AUTHORIZE_HOST: "https://discord.com",
  AUTHORIZE_PATH: "/api/oauth2/authorize",
  TOKEN_HOST: "https://discord.com",
  TOKEN_PATH: "/api/oauth2/token",
} as const;

// Plugin Log Messages
export const PLUGIN_LOG_MESSAGES = {
  GOOGLE_DISABLED: "Google OAuth is disabled",
  GOOGLE_REGISTERED: "Google OAuth plugin registered",
  GOOGLE_MISSING_CREDS: "Google OAuth is enabled but credentials are missing",

  FACEBOOK_DISABLED: "Facebook OAuth is disabled",
  FACEBOOK_REGISTERED: "Facebook OAuth plugin registered",
  FACEBOOK_MISSING_CREDS:
    "Facebook OAuth is enabled but credentials are missing",

  GITHUB_DISABLED: "GitHub OAuth is disabled",
  GITHUB_REGISTERED: "GitHub OAuth plugin registered",
  GITHUB_MISSING_CREDS: "GitHub OAuth is enabled but credentials are missing",

  DISCORD_DISABLED: "Discord OAuth is disabled",
  DISCORD_REGISTERED: "Discord OAuth plugin registered",
  DISCORD_MISSING_CREDS: "Discord OAuth is enabled but credentials are missing",

  LINKEDIN_DISABLED: "LinkedIn OAuth is disabled",
  LINKEDIN_REGISTERED: "LinkedIn OAuth plugin registered",
  LINKEDIN_MISSING_CREDS:
    "LinkedIn OAuth is enabled but credentials are missing",

  DATABASE_CONNECTED: "Prisma connected to Neon PostgreSQL database",
  DATABASE_CONNECTION_FAILED: "Failed to connect to database",
  DATABASE_DISCONNECTED: "Prisma disconnected from database",
} as const;

// Rate Limit Configuration
export const RATE_LIMIT_CONFIG = {
  CACHE_SIZE: 10000,
  SKIP_ON_ERROR: false,
  PLUGIN_NAME: "rate-limit-plugin",
  DEPENDENCY: "config-plugin",
} as const;

// Rate Limit Messages
export const RATE_LIMIT_MESSAGES = {
  TOO_MANY_REQUESTS: "Too Many Requests",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Try again in",
  SECONDS_SUFFIX: "seconds.",
} as const;

// Audit Log Configuration
export const AUDIT_LOG_CONFIG = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  AUDIT_FLAG: true,
  AUDIT_PREFIX: "Audit:",
} as const;

// Environment Values
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

// Prisma Log Levels
export const PRISMA_LOG_LEVELS = {
  DEVELOPMENT: ["warn", "error"] as const,
  PRODUCTION: ["warn", "error"] as const,
} as const;

// Confession limits
export const CONFESSION_CONFIG = {
  DEFAULT_LIMIT: 50,
} as const;

// OAuth Token Interface
export interface OAuthToken {
  token: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };
}

// Provider User Info Interface
export interface ProviderUserInfo {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  picture?: string | { data?: { url?: string } };
  login?: string;
  username?: string;
  avatar_url?: string;
}

// Provider Email Response (for GitHub)
export interface ProviderEmail {
  email: string;
  primary?: boolean;
  verified?: boolean;
}
