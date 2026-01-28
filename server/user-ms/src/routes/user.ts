import { USER_ROUTES } from "@constants";
import { UserController } from "@controllers/user.controller";
import { authGuard } from "@middleware/auth";
import { UserProfileResponseSchema } from "@schemas/auth.schema";
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
import { SessionListResponseSchema } from "@schemas/session.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  // Initialize controller
  const userController = new UserController(fastify);

  // GET /user/profile - Get current user profile
  fastify.get(
    USER_ROUTES.PROFILE,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: UserProfileResponseSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return userController.getProfile(request, reply);
    },
  );

  // GET /user/sessions - Get all active sessions for current user
  fastify.get(
    USER_ROUTES.SESSIONS,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: SessionListResponseSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return userController.getSessions(request, reply);
    },
  );

  // DELETE /user/sessions/:sessionId - Revoke a specific session
  fastify.delete<{ Params: { sessionId: string } }>(
    USER_ROUTES.SESSION_BY_ID,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: SuccessResponseSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return userController.revokeSession(request, reply);
    },
  );

  // DELETE /user/sessions - Logout from all sessions
  fastify.delete(
    USER_ROUTES.SESSIONS,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: SuccessResponseSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return userController.logoutAll(request, reply);
    },
  );
}
