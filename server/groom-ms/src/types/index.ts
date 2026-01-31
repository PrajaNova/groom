import type { OAuth2Namespace } from "@fastify/oauth2";
import type { PrismaClient } from "@generated/client";
import type { Session } from "@schemas/session.schema";
import type { UserResponse as User } from "@schemas/user.schema";

// Extend Fastify instance with custom decorators
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    googleOAuth2?: OAuth2Namespace;
    customOAuth2?: OAuth2Namespace;
    config: AppConfig;
    user?: User;
  }

  interface FastifyRequest {
    session?: Session;
  }
}

// ... existing FastifyJWT declaration ...
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
  providers: {
    google: ProviderConfig;
    custom: CustomProviderConfig;
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
  // ... existing ...

  rateLimit: RateLimitConfig;
  database: DatabaseConfig;
  audit: AuditConfig;

  jitsi: JitsiConfig;
  email: EmailConfig;
}

export interface EmailConfig {
  resendApiKey: string;
  from: string;
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
  logEnabled: boolean;
  logLevel: ("info" | "query" | "warn" | "error")[];
}

export interface RateLimitConfig {
  max: number;
  timeWindow: number;
}

export interface AuditConfig {
  enabled: boolean;
  events: string[];
}

// User, ProviderAccount, Session, Token, AuditLog, ProviderInfo, Auth interfaces should be imported directly from schemas or generated client

export interface OAuthCallbackQuery {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}
