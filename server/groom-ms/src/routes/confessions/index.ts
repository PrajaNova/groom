import { ROUTES } from "@constants";
import { ConfessionController } from "@controllers/confession.controller";
import { authGuard } from "@middleware/auth";
import {
  ConfessionListResponseSchema,
  ConfessionResponseSchema,
  CreateConfessionRequestSchema,
} from "@schemas/confession.schema";
import { ConfessionService } from "@services/confession.service";
import { createRouteSchema } from "@utils/schema";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const confessionRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ConfessionService(fastify);
  const controller = new ConfessionController(service);

  // Public: Read recent confessions
  fastify.get(
    ROUTES.CONFESSIONS,
    {
      schema: createRouteSchema({
        response: { 200: ConfessionListResponseSchema },
        tags: ["Confessions"],
      }),
    },
    controller.getRecent,
  );

  // Public: Create confession (Anonymous)
  fastify.post(
    ROUTES.CONFESSIONS,
    {
      schema: createRouteSchema({
        body: CreateConfessionRequestSchema,
        response: { 201: ConfessionResponseSchema },
        tags: ["Confessions"],
      }),
    },
    controller.create,
  );

  // Admin: Delete Confession
  fastify.delete(
    ROUTES.CONFESSIONS + "/:id",
    {
      preHandler: [authGuard], // Add Admin check if needed
      schema: createRouteSchema({
        params: z.object({ id: z.string() }),
        response: { 200: z.object({ success: z.boolean() }) },
        tags: ["Confessions"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await service.deleteConfession(id); // Ensure service has this method
      return { success: true };
    },
  );

  // Admin: Update Confession
  fastify.put(
    ROUTES.CONFESSIONS + "/:id",
    {
      preHandler: [authGuard], // Add Admin check if needed
      schema: createRouteSchema({
        params: z.object({ id: z.string() }),
        body: z.object({ content: z.string().min(1) }),
        response: { 200: ConfessionResponseSchema },
        tags: ["Confessions"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { content } = request.body as { content: string };
      return await service.updateConfession(id, content); // Ensure service has this method
    },
  );
};

export default confessionRoutes;
