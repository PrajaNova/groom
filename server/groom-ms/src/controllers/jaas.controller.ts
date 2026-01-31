import type { JaasTokenRequest } from "@schemas/jaas.schema";
import type { JaasService } from "@services/jaas.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export class JaasController {
  constructor(private service: JaasService) {}

  generateToken = async (
    req: FastifyRequest<{ Body: JaasTokenRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      // TODO: Extract user from request if authenticated
      const token = this.service.generateToken(req.body.meetingId);
      return { token };
    } catch (error) {
      req.log.error(error);
      return reply.internalServerError("Failed to generate token");
    }
  };
}
