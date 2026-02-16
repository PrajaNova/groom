import { CONFESSION_ROUTES } from "@constants";
import { ConfessionController } from "@controllers/confession.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import {
  ErrorSchema,
  IdParamSchema,
  SuccessResponseSchema,
} from "@schemas/common";
import {
  ConfessionCreateSchema,
  ConfessionListResponseSchema,
  ConfessionResponseSchema,
} from "@schemas/confession.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function confessionRoutes(fastify: FastifyInstance) {
  const confessionController = new ConfessionController(fastify);

  // GET /confessions - List confessions (public)
  fastify.get(
    CONFESSION_ROUTES.LIST,
    {
      schema: createRouteSchema({
        response: { 200: ConfessionListResponseSchema },
      }),
    },
    async (request, reply) => confessionController.list(request, reply),
  );

  // POST /confessions - Create confession (public / anonymous)
  fastify.post(
    CONFESSION_ROUTES.CREATE,
    {
      schema: createRouteSchema({
        body: ConfessionCreateSchema,
        response: { 201: ConfessionResponseSchema, 400: ErrorSchema },
      }),
    },
    async (request, reply) =>
      confessionController.create(request as any, reply),
  );

  // DELETE /confessions/:id - Delete confession (ADMIN only)
  fastify.delete<{ Params: { id: string } }>(
    CONFESSION_ROUTES.DELETE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: { 200: SuccessResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => confessionController.delete(request, reply),
  );
}
