import { AUDIT_LOG_CONFIG } from "@constants";
import type { Prisma } from "@prisma/client";
import type { AuditLog } from "@types";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class AuditService {
  constructor(private fastify: FastifyInstance) {}

  async log(
    event: string,
    metadata: Prisma.JsonValue,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    if (!this.fastify.config.audit.enabled) return;

    // Only log if event is in the configured list
    if (!this.fastify.config.audit.events.includes(event)) return;

    // Safety check: ensure Prisma client is available
    if (!this.fastify.prisma) {
      this.fastify.log.error(
        { event, userId, metadata },
        "Audit log failed: Prisma client not available",
      );
      return;
    }

    await this.fastify.prisma.auditLog.create({
      data: {
        id: nanoid(),
        userId: userId ?? null,
        event,
        metadata: metadata as Prisma.InputJsonValue,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        timestamp: new Date(),
      },
    });

    // Also log to console for immediate visibility
    this.fastify.log.info(
      {
        audit: AUDIT_LOG_CONFIG.AUDIT_FLAG,
        event,
        userId,
        metadata,
      },
      `${AUDIT_LOG_CONFIG.AUDIT_PREFIX} ${event}`,
    );
  }

  async getUserAuditLogs(
    userId: string,
    limit: number = AUDIT_LOG_CONFIG.DEFAULT_LIMIT,
  ): Promise<AuditLog[]> {
    const logs = await this.fastify.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return logs.map((log) => ({
      ...log,
      metadata: log.metadata as Prisma.JsonValue,
    }));
  }

  async getAuditLogs(
    filters: Prisma.AuditLogWhereInput = {},
    limit: number = AUDIT_LOG_CONFIG.MAX_LIMIT,
  ): Promise<AuditLog[]> {
    const logs = await this.fastify.prisma.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return logs.map((log) => ({
      ...log,
      metadata: log.metadata as Prisma.JsonValue,
    }));
  }
}
