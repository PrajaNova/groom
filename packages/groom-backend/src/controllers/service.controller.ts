import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants";
import { ServiceService } from "@services/service.service";
import type { ServiceCreate, ServiceUpdate } from "@schemas/service.schema";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class ServiceController {
  constructor(private fastify: FastifyInstance) {}

  async list(_request: FastifyRequest, _reply: FastifyReply) {
    const serviceService = new ServiceService(this.fastify);
    return await serviceService.getAllServices();
  }

  async create(
    request: FastifyRequest<{
      Body: ServiceCreate;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const serviceService = new ServiceService(this.fastify);

    try {
      const service = await serviceService.createService(request.body);
      return reply.code(201).send(service);
    } catch (_error: any) {
      return reply.internalServerError("Failed to create service");
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: ServiceUpdate;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const serviceService = new ServiceService(this.fastify);
    const service = await serviceService.updateService(
      request.params.id,
      request.body,
    );

    if (!service) {
      return reply.notFound(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }

    return service;
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const serviceService = new ServiceService(this.fastify);
    const success = await serviceService.deleteService(request.params.id);

    if (!success) {
      return reply.notFound(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }

    return { success: true, message: SUCCESS_MESSAGES.SERVICE_DELETED };
  }
}
