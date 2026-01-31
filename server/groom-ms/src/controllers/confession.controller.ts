import type { CreateConfessionRequest } from "@schemas/confession.schema";
import type { ConfessionService } from "@services/confession.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export class ConfessionController {
  constructor(private service: ConfessionService) {}

  getRecent = async (_req: FastifyRequest, reply: FastifyReply) => {
    const confessions = await this.service.getRecentConfessions();
    return reply.send(confessions);
  };

  create = async (
    req: FastifyRequest<{ Body: CreateConfessionRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      const confession = await this.service.createConfession(req.body);
      return reply.code(201).send(confession);
    } catch (error) {
      return reply.internalServerError("Failed to submit confession");
    }
  };
}
