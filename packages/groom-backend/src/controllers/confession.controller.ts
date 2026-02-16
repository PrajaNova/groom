import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants";
import { ConfessionService } from "@services/confession.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class ConfessionController {
  constructor(private fastify: FastifyInstance) {}

  async list(_request: FastifyRequest, _reply: FastifyReply) {
    const confessionService = new ConfessionService(this.fastify);
    return await confessionService.getAllConfessions();
  }

  async create(
    request: FastifyRequest<{ Body: { content: string } }>,
    reply: FastifyReply,
  ) {
    const { content } = request.body;

    if (!content || content.trim().length === 0) {
      return reply.badRequest("Content is required");
    }

    const confessionService = new ConfessionService(this.fastify);

    try {
      const confession = await confessionService.createConfession({ content });
      return reply.code(201).send(confession);
    } catch (_error) {
      return reply.internalServerError("Failed to submit confession");
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const confessionService = new ConfessionService(this.fastify);
    const success = await confessionService.deleteConfession(request.params.id);

    if (!success) {
      return reply.notFound(ERROR_MESSAGES.CONFESSION_NOT_FOUND);
    }

    return { success: true, message: SUCCESS_MESSAGES.CONFESSION_DELETED };
  }
}
