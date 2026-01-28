import { ROUTES } from "@constants";
import { AuthController } from "@controllers/auth.controller";
import { authGuard } from "@middleware/auth";
import {
  AuthResponseSchema,
  LoginRequestSchema,
  ProviderListResponseSchema,
  RegisterRequestSchema,
} from "@schemas/auth.schema";
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
import type { OAuthCallbackQuery } from "@types";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  // Initialize controller
  const authController = new AuthController(fastify);

  // GET /auth/providers - List all enabled providers
  fastify.get(
    ROUTES.AUTH_PROVIDERS,
    {
      schema: createRouteSchema({
        response: {
          200: ProviderListResponseSchema,
        },
      }),
    },
    async (request, reply) => {
      return authController.getProviders(request, reply);
    },
  );

  // POST /auth/register - Register with email/password
  fastify.post(
    ROUTES.AUTH_REGISTER,
    {
      schema: createRouteSchema({
        body: RegisterRequestSchema,
        response: {
          201: AuthResponseSchema,
          400: ErrorSchema,
          409: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return authController.handleRegister(request, reply);
    },
  );

  // POST /auth/login - Login with email/password
  fastify.post(
    ROUTES.AUTH_LOGIN,
    {
      schema: createRouteSchema({
        body: LoginRequestSchema,
        response: {
          200: AuthResponseSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return authController.handleLogin(request, reply);
    },
  );

  // POST /auth/logout - Logout current session
  fastify.post(
    ROUTES.AUTH_LOGOUT,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: SuccessResponseSchema,
          401: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return authController.handleLogout(request, reply);
    },
  );

  // GET /auth/google/callback
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.GOOGLE_CALLBACK,
    async (request, reply) => {
      return authController.handleGoogleCallback(request, reply);
    },
  );

  // GET /auth/github/callback
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.GITHUB_CALLBACK,
    async (request, reply) => {
      return authController.handleGithubCallback(request, reply);
    },
  );

  // GET /auth/facebook/callback
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.FACEBOOK_CALLBACK,
    async (request, reply) => {
      return authController.handleFacebookCallback(request, reply);
    },
  );

  // GET /auth/discord/callback
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.DISCORD_CALLBACK,
    async (request, reply) => {
      return authController.handleDiscordCallback(request, reply);
    },
  );

  // GET /auth/linkedin/callback
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.LINKEDIN_CALLBACK,
    async (request, reply) => {
      return authController.handleLinkedinCallback(request, reply);
    },
  );
}
