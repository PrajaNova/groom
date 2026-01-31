import { ROUTES } from "@constants";
import { AuthController } from "@controllers/auth.controller";
import { authGuard } from "@middleware/auth";
import {
  AuthResponseSchema,
  LoginRequestSchema,
  ProviderListResponseSchema,
  RegisterRequestSchema,
} from "@schemas/auth.schema";
import { ErrorSchema } from "@schemas/common";
import type { OAuthCallbackQuery } from "@types";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController(fastify);

  // GET /auth/providers
  fastify.get(
    ROUTES.AUTH_PROVIDERS,
    {
      schema: createRouteSchema({
        response: {
          200: ProviderListResponseSchema,
        },
        tags: ["Auth"],
      }),
    },
    async (request, reply) => {
      return authController.getProviders(request, reply);
    },
  );

  // POST /auth/register
  fastify.post(
    "/register",
    {
      schema: createRouteSchema({
        body: RegisterRequestSchema,
        response: {
          201: AuthResponseSchema,
          400: ErrorSchema,
        },
        tags: ["Auth"],
      }),
    },
    async (request, reply) => authController.handleRegister(request, reply),
  );

  // POST /auth/login
  fastify.post(
    "/login",
    {
      schema: createRouteSchema({
        body: LoginRequestSchema,
        response: {
          200: AuthResponseSchema,
          401: ErrorSchema,
        },
        tags: ["Auth"],
      }),
    },
    async (request, reply) => authController.handleLogin(request, reply),
  );

  // POST /auth/logout (Protected)
  fastify.post(
    "/logout",
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: z.object({ success: z.boolean(), message: z.string() }),
        },
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => authController.handleLogout(request, reply),
  );

  // GET /auth/me (Protected)
  fastify.get(
    "/me",
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: AuthResponseSchema,
        },
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => authController.handleMe(request, reply),
  );

  // OAuth Callbacks
  fastify.get<{ Querystring: OAuthCallbackQuery }>(
    "/google/callback",
    {
      schema: {
        tags: ["Auth"],
      } as any,
    },
    async (request, reply) => {
      return authController.handleGoogleCallback(request, reply);
    },
  );
}
