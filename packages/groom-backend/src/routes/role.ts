import { ROLE_ROUTES } from "@constants";
import { RoleController } from "@controllers/role.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import {
  ErrorSchema,
  IdParamSchema,
  SuccessResponseSchema,
} from "@schemas/common";
import {
  type AssignRole,
  AssignRoleSchema,
  type RoleCreate,
  RoleCreateSchema,
  RoleListResponseSchema,
  RoleResponseSchema,
} from "@schemas/role.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function roleRoutes(fastify: FastifyInstance) {
  const roleController = new RoleController(fastify);

  // POST /roles - Create a new role (ADMIN only)
  fastify.post<{ Body: RoleCreate }>(
    ROLE_ROUTES.CREATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        body: RoleCreateSchema,
        response: {
          201: RoleResponseSchema,
          400: ErrorSchema,
          401: ErrorSchema,
          403: ErrorSchema,
          409: ErrorSchema,
        },
      }),
    },
    async (request, reply) => roleController.createRole(request, reply),
  );

  // GET /roles - Get all roles (ADMIN only)
  fastify.get(
    ROLE_ROUTES.LIST,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        response: {
          200: RoleListResponseSchema,
          401: ErrorSchema,
          403: ErrorSchema,
        },
      }),
    },
    async (request, reply) => roleController.getRoles(request, reply),
  );

  // POST /users/:id/roles - Assign role to user (ADMIN only)
  fastify.post<{ Params: { id: string }; Body: AssignRole }>(
    ROLE_ROUTES.ASSIGN,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: AssignRoleSchema,
        response: {
          200: SuccessResponseSchema,
          400: ErrorSchema,
          401: ErrorSchema,
          403: ErrorSchema,
        },
      }),
    },
    async (request, reply) => roleController.assignRole(request, reply),
  );

  // DELETE /users/:id/roles/:roleId - Revoke role from user (ADMIN only)
  fastify.delete<{ Params: { id: string; roleId: string } }>(
    ROLE_ROUTES.REVOKE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        response: {
          200: SuccessResponseSchema,
          400: ErrorSchema,
          401: ErrorSchema,
          403: ErrorSchema,
        },
      }),
    },
    async (request, reply) => roleController.revokeRole(request, reply),
  );
}
