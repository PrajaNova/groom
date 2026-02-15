import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants";
import { TestimonialService } from "@services/testimonial.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class TestimonialController {
  constructor(private fastify: FastifyInstance) {}

  async list(_request: FastifyRequest, _reply: FastifyReply) {
    const testimonialService = new TestimonialService(this.fastify);
    return await testimonialService.getAllTestimonials();
  }

  async create(
    request: FastifyRequest<{ Body: { quote: string; author: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { quote, author } = request.body;

    if (!quote || !author) {
      return reply.badRequest("Quote and author are required");
    }

    const testimonialService = new TestimonialService(this.fastify);

    try {
      const testimonial = await testimonialService.createTestimonial({
        quote,
        author,
      });
      return reply.code(201).send(testimonial);
    } catch (_error) {
      return reply.internalServerError("Failed to create testimonial");
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<{ quote: string; author: string }>;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const testimonialService = new TestimonialService(this.fastify);
    const testimonial = await testimonialService.updateTestimonial(
      request.params.id,
      request.body,
    );

    if (!testimonial) {
      return reply.notFound(ERROR_MESSAGES.TESTIMONIAL_NOT_FOUND);
    }

    return testimonial;
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const testimonialService = new TestimonialService(this.fastify);
    const success = await testimonialService.deleteTestimonial(
      request.params.id,
    );

    if (!success) {
      return reply.notFound(ERROR_MESSAGES.TESTIMONIAL_NOT_FOUND);
    }

    return { success: true, message: SUCCESS_MESSAGES.TESTIMONIAL_DELETED };
  }
}
