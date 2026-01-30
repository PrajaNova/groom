import { JaasTokenRequestSchema } from "@schemas/jaas.schema";
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
      // Pass the authenticated user if available (from @fastify/jwt or session)
      // user-ms uses 'request.user' if auth guard is used, or no user if public endpoint.
      // We'll assume it can be public or authenticated.
      const user = request.user;

      const token = await jaasService.generateToken(meetingId, user);

      return reply.send({ token, appId: this.fastify.config.jitsi.appId });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to generate token" });
    }
  }
}
