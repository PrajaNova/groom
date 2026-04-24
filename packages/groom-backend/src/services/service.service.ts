import type { Service } from "@generated/client";
import {
  type ServiceCreate,
  ServiceCreateSchema,
  type ServiceUpdate,
  ServiceUpdateSchema,
} from "@schemas/service.schema";
import type { FastifyInstance } from "fastify";

export class ServiceService {
  constructor(private fastify: FastifyInstance) {}

  async getAllServices(): Promise<Service[]> {
    return this.fastify.prisma.service.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.fastify.prisma.service.findUnique({
      where: { id },
    });
  }

  async createService(data: ServiceCreate): Promise<Service> {
    const validated = ServiceCreateSchema.parse(data);

    return this.fastify.prisma.service.create({
      data: {
        title: validated.title,
        description: validated.description,
        iconType: validated.iconType,
        colorType: validated.colorType,
        order: validated.order,
      },
    });
  }

  async updateService(id: string, data: ServiceUpdate): Promise<Service | null> {
    const validated = ServiceUpdateSchema.parse(data);

    const service = await this.getServiceById(id);
    if (!service) {
      return null;
    }

    return this.fastify.prisma.service.update({
      where: { id },
      data: validated,
    });
  }

  async deleteService(id: string): Promise<boolean> {
    const service = await this.getServiceById(id);
    if (!service) {
      return false;
    }

    await this.fastify.prisma.service.delete({
      where: { id },
    });

    return true;
  }
}
