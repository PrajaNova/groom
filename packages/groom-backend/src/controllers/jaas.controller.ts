import type { JaasTokenRequestSchema } from "@schemas/jaas.schema";
import { JaasService } from "@services/jaas.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";

type JaasTokenRequest = z.infer<typeof JaasTokenRequestSchema>;

export class JaasController {
  constructor(private fastify: FastifyInstance) {}

  async generateToken(
    request: FastifyRequest<{ Body: JaasTokenRequest }>,
    reply: FastifyReply,
  ) {
    const { meetingId } = request.body;
    const jaasService = new JaasService(this.fastify);

    try {
      const user = request.user;
      const token = await jaasService.generateToken(meetingId, user);

      return reply.send({ token, appId: this.fastify.config.jitsi.appId });
    } catch (error) {
      request.log.error(error);
      return reply.internalServerError("Failed to generate token");
    }
  }
}
