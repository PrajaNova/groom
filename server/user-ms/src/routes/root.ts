import { SYSTEM_ROUTES } from "@constants";
import { RootController } from "@controllers/root.controller";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

// Simple response schemas for system endpoints
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

/**
 * Root and health check routes
 * @see https://fastify.dev/docs/latest/Reference/Routes/
 */
const root: FastifyPluginAsync = async (
  fastify: FastifyInstance,
): Promise<void> => {
  // Initialize controller
  const rootController = new RootController(fastify);

  // Service info endpoint
  fastify.get(
    SYSTEM_ROUTES.ROOT,
    {
      schema: createRouteSchema({
        response: {
          200: ServiceInfoSchema,
        },
      }),
    },
    async (request, reply) => {
      return rootController.getServiceInfo(request, reply);
    },
  );

  // Health check endpoint
  fastify.get(
    SYSTEM_ROUTES.HEALTH,
    {
      schema: createRouteSchema({
        response: {
          200: HealthSchema,
        },
      }),
    },
    async (request, reply) => {
      return rootController.getHealth(request, reply);
    },
  );

  // Readiness probe (checks database connection)
  fastify.get(
    SYSTEM_ROUTES.READY,
    {
      schema: createRouteSchema({
        response: {
          200: ReadinessSchema,
        },
      }),
    },
    async (request, reply) => {
      return rootController.getReadiness(request, reply);
    },
  );
};

export default root;
