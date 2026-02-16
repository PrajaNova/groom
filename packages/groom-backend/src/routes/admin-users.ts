import { USERS_ROUTES } from "@constants";
import { AdminUsersController } from "@controllers/admin-users.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import { ErrorSchema, IdParamSchema, SuccessResponseSchema } from "@schemas/common";
import { UserListResponseSchema } from "@schemas/user.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

const ResetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(100),
});

export default async function adminUsersRoutes(fastify: FastifyInstance) {
  const adminUsersController = new AdminUsersController(fastify);

  // GET /users - List all users (ADMIN only)
  fastify.get(
    USERS_ROUTES.LIST,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        response: {
          200: UserListResponseSchema,
          401: ErrorSchema,
          403: ErrorSchema,
        },
      }),
    },
    async (request, reply) => adminUsersController.listUsers(request, reply),
  );

  // GET /users/:id - Get user by ID (ADMIN only)
  fastify.get<{ Params: { id: string } }>(
    USERS_ROUTES.BY_ID,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: {
          200: z.object({ user: z.any() }),
          404: ErrorSchema,
        },
      }),
    },
    async (request, reply) => adminUsersController.getUserById(request, reply),
  );

  // DELETE /users/:id - Delete user (ADMIN only)
  fastify.delete<{ Params: { id: string } }>(
    USERS_ROUTES.BY_ID,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: {
          200: SuccessResponseSchema,
          403: ErrorSchema,
          404: ErrorSchema,
        },
      }),
    },
    async (request, reply) => adminUsersController.deleteUser(request, reply),
  );

  // POST /users/:id/reset-password - Reset user password (ADMIN only)
  fastify.post<{ Params: { id: string }; Body: { newPassword: string } }>(
    "/users/:id/reset-password",
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: ResetPasswordSchema,
        response: {
          200: SuccessResponseSchema,
          404: ErrorSchema,
        },
      }),
    },
    async (request, reply) => adminUsersController.resetPassword(request, reply),
  );
}
