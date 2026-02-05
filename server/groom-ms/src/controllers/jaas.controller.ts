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
      if (!req.user) {
        return reply.unauthorized("Authentication required");
      }

      const user = {
        ...req.user,
        roles: req.user.roles?.map((r) => ({
          ...r,
          description: r.description ?? null,
        })),
      };

      const token = this.service.generateToken(req.body.meetingId, user);
      return { token };
    } catch (error) {
      req.log.error(error);
      return reply.internalServerError("Failed to generate token");
    }
  };
}
