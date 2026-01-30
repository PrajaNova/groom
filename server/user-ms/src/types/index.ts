import type { OAuth2Namespace } from "@fastify/oauth2";
import type { Prisma, PrismaClient } from "@generated/client";

// Extend Fastify instance with custom decorators
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    googleOAuth2?: OAuth2Namespace;
    facebookOAuth2?: OAuth2Namespace;
    githubOAuth2?: OAuth2Namespace;
    discordOAuth2?: OAuth2Namespace;
    linkedinOAuth2?: OAuth2Namespace;
    customOAuth2?: OAuth2Namespace;
    config: AppConfig;
  }

  interface FastifyRequest {
    session?: Session;
  }
}

// Declare the user type for @fastify/jwt
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: User;
  }
}

export interface AppConfig {
  server: {
    port: number;
    host: string;
    nodeEnv: string;
    logLevel: string;
  };
  security: {
    cookieSecret: string;
    jwtSecret: string;
    sessionExpiryHours: number;
    allowedOrigins: string[];
    frontendUrl: string;
  };
  branding: {
    name: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    loginTitle: string;
    loginSubtitle: string;
    loginFooter: string;
  };
  providers: {
    google: ProviderConfig;
    facebook: ProviderConfig;
    github: ProviderConfig;
    discord: ProviderConfig;
    linkedin: ProviderConfig;
    custom: CustomProviderConfig;
  };
  rateLimit: RateLimitConfig;
  database: DatabaseConfig;
  audit: AuditConfig;
  jitsi: JitsiConfig;
}

export interface JitsiConfig {
  appId: string;
  apiKey: string;
  privateKey: string;
}

export interface ProviderConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scopes: string[];
}

export interface CustomProviderConfig extends ProviderConfig {
  name: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

export interface DatabaseConfig {
  logLevel: string;
}

export interface RateLimitConfig {
  max: number;
  timeWindow: number;
}

export interface AuditConfig {
  enabled: boolean;
  events: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  password?: string; // For local authentication
  createdAt: Date;
  updatedAt: Date;
  roles?: string[];
}
export interface ProviderAccount {
  id: string;
  userId: string;
  provider: string;
  providerUserId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  sessionId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  device?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface Token {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken?: string;
  provider: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  event: string;
  metadata: Prisma.JsonValue;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: Date;
}

export interface OAuthCallbackQuery {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface ProviderInfo {
  name: string;
  displayName: string;
  icon: string;
  enabled: boolean;
}

// Local Authentication Interfaces
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  sessionToken: string;
}
