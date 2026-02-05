import type { PrismaClient } from "@generated/client";
import type { CreateConfessionRequest } from "@schemas/confession.schema";
import type { FastifyInstance } from "fastify";

export class ConfessionService {
  private prisma: PrismaClient;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
  }

  async getRecentConfessions(limit = 50) {
    return await this.prisma.confession.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async createConfession(data: CreateConfessionRequest) {
    return await this.prisma.confession.create({
      data: {
        content: data.content,
      },
    });
  }

  async deleteConfession(id: string) {
    return await this.prisma.confession.delete({
      where: { id },
    });
  }

  async updateConfession(id: string, content: string) {
    return await this.prisma.confession.update({
      where: { id },
      data: { content },
    });
  }
}
