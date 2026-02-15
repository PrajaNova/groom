import { SYSTEM_ROUTES } from "@constants";
import { RootController } from "@controllers/root.controller";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

const ServiceInfoSchema = z.object({
  service: z.string(),
  version: z.string(),
  environment: z.string(),
  uptime: z.number(),
});

const HealthSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
});

const ReadinessSchema = z.object({
  status: z.string(),
  database: z.string(),
  timestamp: z.string(),
});

const root: FastifyPluginAsync = async (
  fastify: FastifyInstance,
): Promise<void> => {
  const rootController = new RootController(fastify);

  fastify.get(
    SYSTEM_ROUTES.ROOT,
    {
      schema: createRouteSchema({
        response: { 200: ServiceInfoSchema },
      }),
    },
    async (request, reply) => rootController.getServiceInfo(request, reply),
  );

  fastify.get(
    SYSTEM_ROUTES.HEALTH,
    {
      schema: createRouteSchema({
        response: { 200: HealthSchema },
      }),
    },
    async (request, reply) => rootController.getHealth(request, reply),
  );

  fastify.get(
    SYSTEM_ROUTES.READY,
    {
      schema: createRouteSchema({
        response: { 200: ReadinessSchema },
      }),
    },
    async (request, reply) => rootController.getReadiness(request, reply),
  );
};

export default root;
