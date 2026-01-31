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
  AUTH_PROVIDERS: "/providers",
  AUTH_REGISTER: "/register",
  AUTH_LOGIN: "/login",
  AUTH_LOGOUT: "/logout",
  AUTH_ME: "/me",

  // OAuth callbacks
  GOOGLE_CALLBACK: "/google/callback",
  GITHUB_CALLBACK: "/github/callback",
  FACEBOOK_CALLBACK: "/facebook/callback",
  DISCORD_CALLBACK: "/discord/callback",
  LINKEDIN_CALLBACK: "/linkedin/callback",

  // Blog Routes
  BLOGS: "/",
  BLOG_BY_SLUG: "/:slug",

  // Booking Routes
  BOOKINGS: "/",
  BOOKING_BY_ID: "/:id",

  // Confession Routes
  CONFESSIONS: "/",

  // JaaS Routes
  JAAS: "/",
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
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH_SUCCESS: "Authentication successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  SESSION_REVOKED: "Session revoked",
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
  GITHUB: "groom-ms", // Custom user agent
} as const;

// Log Messages
export const LOG_MESSAGES = {
  OAUTH_CALLBACK_RECEIVED: "OAuth callback received",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Service Information
export const SERVICE_INFO = {
  NAME: "groom-ms",
  VERSION: "1.0.0",
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
