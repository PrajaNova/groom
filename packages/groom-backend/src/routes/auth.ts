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
  const authController = new AuthController(fastify);

  fastify.get(
    ROUTES.AUTH_PROVIDERS,
    {
      schema: createRouteSchema({
        response: { 200: ProviderListResponseSchema },
      }),
    },
    async (request, reply) => authController.getProviders(request, reply),
  );

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
    async (request, reply) => authController.handleRegister(request, reply),
  );

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
    async (request, reply) => authController.handleLogin(request, reply),
  );

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
    async (request, reply) => authController.handleLogout(request, reply),
  );

  // OAuth callbacks
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.GOOGLE_CALLBACK,
    async (request, reply) => authController.handleGoogleCallback(request, reply),
  );

  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.GITHUB_CALLBACK,
    async (request, reply) => authController.handleGithubCallback(request, reply),
  );

  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.FACEBOOK_CALLBACK,
    async (request, reply) => authController.handleFacebookCallback(request, reply),
  );

  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.DISCORD_CALLBACK,
    async (request, reply) => authController.handleDiscordCallback(request, reply),
  );

  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    ROUTES.LINKEDIN_CALLBACK,
    async (request, reply) => authController.handleLinkedinCallback(request, reply),
  );
}
