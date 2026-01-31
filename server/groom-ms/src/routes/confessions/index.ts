import { ROUTES } from "@constants";
import { ConfessionController } from "@controllers/confession.controller";
import {
  ConfessionListResponseSchema,
  ConfessionResponseSchema,
  CreateConfessionRequestSchema,
} from "@schemas/confession.schema";
import { ConfessionService } from "@services/confession.service";
import { createRouteSchema } from "@utils/schema";
import type { FastifyPluginAsync } from "fastify";

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
};

export default confessionRoutes;
