import { ROUTES } from "@constants";
import { JaasController } from "@controllers/jaas.controller";
import { authGuard } from "@middleware/auth";
import {
  type JaasTokenRequest,
  JaasTokenRequestSchema,
  JaasTokenResponseSchema,
} from "@schemas/jaas.schema";
import { JaasService } from "@services/jaas.service";
import type { FastifyPluginAsync } from "fastify";

const jaasRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new JaasService(fastify);
  const controller = new JaasController(service);

  fastify.post<{ Body: JaasTokenRequest }>(
    ROUTES.JAAS,
    {
      preHandler: authGuard,
      schema: {
        body: JaasTokenRequestSchema,
        response: { 200: JaasTokenResponseSchema },
        tags: ["JaaS"],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    controller.generateToken,
  );
};

export default jaasRoutes;
