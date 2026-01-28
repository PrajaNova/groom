import type { AppConfig } from "@types";
import dotenv from "dotenv";

dotenv.config();

const parseScopes = (scopeString: string | undefined): string[] => {
  if (!scopeString) return [];
  return scopeString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const parseOrigins = (originsString: string | undefined): string[] => {
  if (!originsString) return ["http://localhost:3000"];
  return originsString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const parseEvents = (eventsString: string | undefined): string[] => {
  if (!eventsString) return ["login", "logout", "register"];
  return eventsString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const getEnv = (key: string, defaultValue: string = ""): string => {
  return process.env[key] || defaultValue;
};

const getBoolEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const getNumberEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const loadConfig = (): AppConfig => {
  return {
    server: {
      port: getNumberEnv("PORT", 3002),
      host: getEnv("HOST", "0.0.0.0"),
      nodeEnv: getEnv("NODE_ENV", "development"),
      logLevel: getEnv("LOG_LEVEL", "info"),
    },
    security: {
      cookieSecret: getEnv(
        "COOKIE_SECRET",
        "your-super-secret-cookie-key-min-32-chars",
      ),
      jwtSecret: getEnv("JWT_SECRET", "your-super-secret-jwt-key-min-32-chars"),
      sessionExpiryHours: getNumberEnv("SESSION_EXPIRY_HOURS", 24),
      allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
    },
    branding: {
      name: getEnv("BRAND_NAME", "E-Cart"),
      logoUrl: getEnv("BRAND_LOGO_URL", ""),
      primaryColor: getEnv("BRAND_PRIMARY_COLOR", "#4F46E5"),
      secondaryColor: getEnv("BRAND_SECONDARY_COLOR", "#10B981"),
      loginTitle: getEnv("LOGIN_TITLE", "Welcome Back"),
      loginSubtitle: getEnv("LOGIN_SUBTITLE", "Sign in to continue"),
      loginFooter: getEnv(
        "LOGIN_FOOTER",
        "By signing in, you agree to our Terms and Privacy Policy",
      ),
    },
    providers: {
      google: {
        enabled: getBoolEnv("AUTH_GOOGLE_ENABLED", false),
        clientId: getEnv("AUTH_GOOGLE_CLIENT_ID"),
        clientSecret: getEnv("AUTH_GOOGLE_CLIENT_SECRET"),
        callbackUrl: getEnv(
          "AUTH_GOOGLE_CALLBACK_URL",
          "http://localhost:3002/auth/google/callback",
        ),
        scopes: parseScopes(
          getEnv("AUTH_GOOGLE_SCOPES", "openid,profile,email"),
        ),
      },
      facebook: {
        enabled: getBoolEnv("AUTH_FACEBOOK_ENABLED", false),
        clientId: getEnv("AUTH_FACEBOOK_APP_ID"),
        clientSecret: getEnv("AUTH_FACEBOOK_APP_SECRET"),
        callbackUrl: getEnv(
          "AUTH_FACEBOOK_CALLBACK_URL",
          "http://localhost:3002/auth/facebook/callback",
        ),
        scopes: parseScopes(
          getEnv("AUTH_FACEBOOK_SCOPES", "email,public_profile"),
        ),
      },
      github: {
        enabled: getBoolEnv("AUTH_GITHUB_ENABLED", false),
        clientId: getEnv("AUTH_GITHUB_CLIENT_ID"),
        clientSecret: getEnv("AUTH_GITHUB_CLIENT_SECRET"),
        callbackUrl: getEnv(
          "AUTH_GITHUB_CALLBACK_URL",
          "http://localhost:3002/auth/github/callback",
        ),
        scopes: parseScopes(
          getEnv("AUTH_GITHUB_SCOPES", "read:user,user:email"),
        ),
      },
      discord: {
        enabled: getBoolEnv("AUTH_DISCORD_ENABLED", false),
        clientId: getEnv("AUTH_DISCORD_CLIENT_ID"),
        clientSecret: getEnv("AUTH_DISCORD_CLIENT_SECRET"),
        callbackUrl: getEnv(
          "AUTH_DISCORD_CALLBACK_URL",
          "http://localhost:3002/auth/discord/callback",
        ),
        scopes: parseScopes(getEnv("AUTH_DISCORD_SCOPES", "identify,email")),
      },
      linkedin: {
        enabled: getBoolEnv("AUTH_LINKEDIN_ENABLED", false),
        clientId: getEnv("AUTH_LINKEDIN_CLIENT_ID"),
        clientSecret: getEnv("AUTH_LINKEDIN_CLIENT_SECRET"),
        callbackUrl: getEnv(
          "AUTH_LINKEDIN_CALLBACK_URL",
          "http://localhost:3002/auth/linkedin/callback",
        ),
        scopes: parseScopes(
          getEnv("AUTH_LINKEDIN_SCOPES", "openid,profile,email"),
        ),
      },
      custom: {
        enabled: getBoolEnv("AUTH_CUSTOM_ENABLED", false),
        name: getEnv("AUTH_CUSTOM_NAME", "Custom Provider"),
        clientId: getEnv("AUTH_CUSTOM_CLIENT_ID"),
        clientSecret: getEnv("AUTH_CUSTOM_CLIENT_SECRET"),
        callbackUrl: getEnv(
          "AUTH_CUSTOM_CALLBACK_URL",
          "http://localhost:3002/auth/custom/callback",
        ),
        scopes: parseScopes(
          getEnv("AUTH_CUSTOM_SCOPES", "openid,profile,email"),
        ),
        authorizationUrl: getEnv("AUTH_CUSTOM_AUTHORIZATION_URL"),
        tokenUrl: getEnv("AUTH_CUSTOM_TOKEN_URL"),
        userInfoUrl: getEnv("AUTH_CUSTOM_USERINFO_URL"),
      },
    },
    rateLimit: {
      max: getNumberEnv("RATE_LIMIT_MAX", 100),
      timeWindow: getNumberEnv("RATE_LIMIT_TIMEWINDOW", 900000),
    },
    database: {
      logLevel: getEnv("PRISMA_LOG_LEVEL", "warn,error"),
    },
    audit: {
      enabled: getBoolEnv("AUDIT_LOG_ENABLED", true),
      events: parseEvents(process.env.AUDIT_LOG_EVENTS),
    },
  };
};
