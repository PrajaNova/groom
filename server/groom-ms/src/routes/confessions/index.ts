import { ConfessionController } from "@controllers/confession.controller";
import {
  ConfessionListResponseSchema,
  ConfessionResponseSchema,
  CreateConfessionRequestSchema,
} from "@schemas/confession.schema";
import { ConfessionService } from "@services/confession.service";
import type { FastifyPluginAsync } from "fastify";

const confessionRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ConfessionService(fastify);
  const controller = new ConfessionController(service);

  // Public: Read recent confessions
  fastify.get(
    "/",
    {
      schema: {
        response: { 200: ConfessionListResponseSchema },
        tags: ["Confessions"],
      },
    },
    controller.getRecent,
  );

  // Public: Create confession (Anonymous)
  fastify.post(
    "/",
    {
      schema: {
        body: CreateConfessionRequestSchema,
        response: { 201: ConfessionResponseSchema },
        tags: ["Confessions"],
      },
    },
    controller.create,
  );
};

export default confessionRoutes;
