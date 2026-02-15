import { USER_ROUTES } from "@constants";
import { UserController } from "@controllers/user.controller";
import { authGuard } from "@middleware/auth";
import { UserProfileResponseSchema, AuthResponseSchema } from "@schemas/auth.schema";
import { UserUpdateSchema } from "@schemas/user.schema";
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
import { SessionListResponseSchema } from "@schemas/session.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
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
        },
      }),
    },
    async (request, reply) => userController.getProfile(request, reply),
  );

  // PUT /user/profile - Update current user profile (including address fields)
  fastify.put(
    USER_ROUTES.UPDATE_PROFILE,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        body: UserUpdateSchema,
        response: {
          200: AuthResponseSchema, // returns success: true, user: updatedUser
          400: ErrorSchema,
          401: ErrorSchema,
        },
      }),
    },
    async (request, reply) => userController.updateProfile(request, reply),
  );

  // GET /user/sessions - List active sessions
  fastify.get(
    USER_ROUTES.SESSIONS,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: SessionListResponseSchema,
          401: ErrorSchema,
        },
      }),
    },
    async (request, reply) => userController.getSessions(request, reply),
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
        },
      }),
    },
    async (request, reply) => userController.revokeSession(request, reply),
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
        },
      }),
    },
    async (request, reply) => userController.logoutAll(request, reply),
  );
}
