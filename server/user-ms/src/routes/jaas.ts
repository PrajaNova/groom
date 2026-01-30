import { JaasController } from "@controllers/jaas.controller";
import { authGuard } from "@middleware/auth";
import {
  JaasTokenRequestSchema,
  JaasTokenResponseSchema,
} from "@schemas/jaas.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function jaasRoutes(fastify: FastifyInstance) {
  const jaasController = new JaasController(fastify);

  fastify.post(
    "/jaas/token",
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        body: JaasTokenRequestSchema,
        response: {
          200: JaasTokenResponseSchema,
        },
      }),
    },
    async (request, reply) => {
      // @ts-ignore - Body type inference is tricky with Zod and Fastify sometimes
      return jaasController.generateToken(request, reply);
    },
  );
}
