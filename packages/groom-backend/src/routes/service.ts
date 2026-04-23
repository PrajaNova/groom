import { SERVICE_ROUTES } from "@constants";
import { ServiceController } from "@controllers/service.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import {
  ServiceCreateSchema,
  ServiceListResponseSchema,
  ServiceResponseSchema,
  ServiceUpdateSchema,
} from "@schemas/service.schema";
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

const IdParamSchema = z.object({ id: z.string().cuid() });

export default async function serviceRoutes(fastify: FastifyInstance) {
  const serviceController = new ServiceController(fastify);

  // GET /services - List all services (public)
  fastify.get(
    SERVICE_ROUTES.LIST,
    {
      schema: createRouteSchema({
        response: { 200: ServiceListResponseSchema },
      }),
    },
    async (request, reply) => serviceController.list(request, reply),
  );

  // POST /services - Create service (ADMIN only)
  fastify.post(
    SERVICE_ROUTES.CREATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        body: ServiceCreateSchema,
        response: {
          201: ServiceResponseSchema,
          400: ErrorSchema,
        },
      }),
    },
    async (request, reply) => serviceController.create(request as any, reply),
  );

  // PUT /services/:id - Update service (ADMIN only)
  fastify.put<{ Params: { id: string } }>(
    SERVICE_ROUTES.BY_ID,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: ServiceUpdateSchema,
        response: { 200: ServiceResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => serviceController.update(request as any, reply),
  );

  // DELETE /services/:id - Delete service (ADMIN only)
  fastify.delete<{ Params: { id: string } }>(
    SERVICE_ROUTES.DELETE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: { 200: SuccessResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => serviceController.delete(request, reply),
  );
}
