import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants";
import { FAQService } from "@services/faq.service";
import type { FAQCreate, FAQUpdate } from "@schemas/faq.schema";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class FAQController {
  constructor(private fastify: FastifyInstance) {}

  async list(_request: FastifyRequest, _reply: FastifyReply) {
    const faqService = new FAQService(this.fastify);
    return await faqService.getAllFAQs();
  }

  async create(
    request: FastifyRequest<{
      Body: FAQCreate;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const faqService = new FAQService(this.fastify);

    try {
      const faq = await faqService.createFAQ(request.body);
      return reply.code(201).send(faq);
    } catch (_error: any) {
      return reply.internalServerError("Failed to create FAQ");
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: FAQUpdate;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const faqService = new FAQService(this.fastify);
    const faq = await faqService.updateFAQ(
      request.params.id,
      request.body,
    );

    if (!faq) {
      return reply.notFound(ERROR_MESSAGES.FAQ_NOT_FOUND);
    }

    return faq;
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const faqService = new FAQService(this.fastify);
    const success = await faqService.deleteFAQ(request.params.id);

    if (!success) {
      return reply.notFound(ERROR_MESSAGES.FAQ_NOT_FOUND);
    }

    return { success: true, message: SUCCESS_MESSAGES.FAQ_DELETED };
  }
}
