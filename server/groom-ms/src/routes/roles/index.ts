import { ROUTES } from "@constants";
import { RoleController } from "@controllers/role.controller";
import { authGuard } from "@middleware/auth";
import { requireAnyRole } from "@middleware/role";
import {
  type AssignRoles,
  AssignRolesSchema,
  type RevokeRoles,
  RevokeRolesSchema,
  type RoleCreate,
  RoleCreateSchema,
  RoleListResponseSchema,
  RoleResponseSchema,
  type RoleUpdate,
  RoleUpdateSchema,
} from "@schemas/role.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

export default async function roleRoutes(fastify: FastifyInstance) {
  const roleController = new RoleController(fastify);

  // Helper middleware for Admin/SuperAdmin access
  const adminGuard = {
    preHandler: [authGuard, requireAnyRole(["ADMIN", "SUPER_ADMIN"])],
  };

  // GET /roles (Admin/SuperAdmin)
  fastify.get(
    "/",
    {
      ...adminGuard,
      schema: createRouteSchema({
        response: {
          200: RoleListResponseSchema,
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.getAllRoles(request, reply),
  );

  // GET /roles/:id (Authenticated) - Get user roles
  fastify.get<{ Params: { id: string } }>(
    ROUTES.ROLE_BY_ID,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        params: z.object({ id: z.string().cuid() }),
        response: {
          200: z.array(z.string()),
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.getUserRoles(request, reply),
  );

  // POST /roles/add (Admin/SuperAdmin)
  fastify.post<{ Body: AssignRoles }>(
    ROUTES.ROLE_ADD,
    {
      ...adminGuard,
      schema: createRouteSchema({
        body: AssignRolesSchema,
        response: {
          200: z.object({ success: z.boolean(), message: z.string() }),
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.addRoles(request, reply),
  );

  // POST /roles/remove (Admin/SuperAdmin)
  fastify.post<{ Body: RevokeRoles }>(
    ROUTES.ROLE_REMOVE,
    {
      ...adminGuard,
      schema: createRouteSchema({
        body: RevokeRolesSchema,
        response: {
          200: z.object({ success: z.boolean(), message: z.string() }),
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.removeRoles(request, reply),
  );

  // POST /roles/create (Admin/SuperAdmin)
  fastify.post<{ Body: RoleCreate }>(
    ROUTES.ROLE_CREATE,
    {
      ...adminGuard,
      schema: createRouteSchema({
        body: RoleCreateSchema,
        response: {
          201: RoleResponseSchema,
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.createRole(request, reply),
  );

  // DELETE /roles/:id (Admin/SuperAdmin)
  fastify.delete<{ Params: { id: string } }>(
    ROUTES.ROLE_BY_ID,
    {
      ...adminGuard,
      schema: createRouteSchema({
        params: z.object({ id: z.string().cuid() }),
        response: {
          200: z.object({ success: z.boolean(), message: z.string() }),
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.deleteRole(request, reply),
  );

  // PATCH /roles/:id (Admin/SuperAdmin)
  fastify.patch<{ Params: { id: string }; Body: RoleUpdate }>(
    ROUTES.ROLE_BY_ID,
    {
      ...adminGuard,
      schema: createRouteSchema({
        params: z.object({ id: z.string().cuid() }),
        body: RoleUpdateSchema,
        response: {
          200: RoleResponseSchema,
        },
        tags: ["Roles"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => roleController.updateRole(request, reply),
  );
}
