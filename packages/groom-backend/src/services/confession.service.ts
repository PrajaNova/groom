import type { Confession } from "@generated/client";
import { ConfessionCreateSchema } from "@schemas/confession.schema";
import { CONFESSION_CONFIG } from "@constants";
import type { FastifyInstance } from "fastify";

export class ConfessionService {
  constructor(private fastify: FastifyInstance) {}

  async getAllConfessions(limit: number = CONFESSION_CONFIG.DEFAULT_LIMIT): Promise<Confession[]> {
    return this.fastify.prisma.confession.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getConfessionById(id: string): Promise<Confession | null> {
    return this.fastify.prisma.confession.findUnique({
      where: { id },
    });
  }

  async createConfession(data: { content: string }): Promise<Confession> {
    const validated = ConfessionCreateSchema.parse(data);

    return this.fastify.prisma.confession.create({
      data: {
        content: validated.content,
      },
    });
  }

  async deleteConfession(id: string): Promise<boolean> {
    const confession = await this.getConfessionById(id);
    if (!confession) {
      return false;
    }

    await this.fastify.prisma.confession.delete({
      where: { id },
    });

    return true;
  }
}
