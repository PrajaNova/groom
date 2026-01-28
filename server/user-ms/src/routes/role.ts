import { ROLE_ROUTES } from "@constants";
import { RoleController } from "@controllers/role.controller";
import { authGuard } from "@middleware/auth";
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
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function roleRoutes(fastify: FastifyInstance) {
  const roleController = new RoleController(fastify);

  // Helper to protect routes
  const protect = async (request: FastifyRequest, reply: FastifyReply) => {
    await authGuard(request, reply);
  };

  // POST /roles - Create a new role
  fastify.post<{ Body: RoleCreate }>(
    ROLE_ROUTES.CREATE,
    {
      preHandler: [protect],
      schema: createRouteSchema({
        body: RoleCreateSchema,
        response: {
          201: RoleResponseSchema,
          400: ErrorSchema,
          401: ErrorSchema,
          409: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return roleController.createRole(request, reply);
    },
  );

  // GET /roles - Get all roles
  fastify.get(
    ROLE_ROUTES.LIST,
    {
      preHandler: [protect],
      schema: createRouteSchema({
        response: {
          200: RoleListResponseSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return roleController.getRoles(request, reply);
    },
  );

  // POST /users/:id/roles - Assign role to user
  fastify.post<{ Params: { id: string }; Body: AssignRole }>(
    ROLE_ROUTES.ASSIGN,
    {
      preHandler: [protect],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: AssignRoleSchema,
        response: {
          200: SuccessResponseSchema,
          400: ErrorSchema,
          401: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return roleController.assignRole(request, reply);
    },
  );
}
