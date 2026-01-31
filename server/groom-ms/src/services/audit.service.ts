import type { Prisma, PrismaClient } from "@generated/client";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class AuditService {
  private prisma: PrismaClient;
  private enabled: boolean;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
    this.enabled = fastify.config.audit.enabled;
  }

  async log(
    event: string,
    metadata?: Record<string, any>,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    if (!this.enabled) return;

    try {
      await this.prisma.auditLog.create({
        data: {
          id: nanoid(),
          userId,
          event,
          metadata: metadata as Prisma.InputJsonValue,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      console.error("Failed to create audit log", error);
    }
  }
}
