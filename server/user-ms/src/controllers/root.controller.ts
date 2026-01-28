import { ENDPOINT_DOCS, HEALTH_MESSAGES, SERVICE_INFO } from "@constants";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class RootController {
  constructor(private fastify: FastifyInstance) {}

  // GET / - Service information
  async getServiceInfo(_request: FastifyRequest, _reply: FastifyReply) {
    return {
      service: SERVICE_INFO.NAME,
      version: SERVICE_INFO.VERSION,
      description: SERVICE_INFO.DESCRIPTION,
      endpoints: {
        auth: {
          providers: ENDPOINT_DOCS.AUTH_PROVIDERS,
          start: ENDPOINT_DOCS.AUTH_START,
          callback: ENDPOINT_DOCS.AUTH_CALLBACK,
          logout: ENDPOINT_DOCS.AUTH_LOGOUT,
        },
        user: {
          profile: ENDPOINT_DOCS.USER_PROFILE,
          sessions: ENDPOINT_DOCS.USER_SESSIONS,
          revokeSession: ENDPOINT_DOCS.USER_REVOKE_SESSION,
          logoutAll: ENDPOINT_DOCS.USER_LOGOUT_ALL,
        },
        health: ENDPOINT_DOCS.HEALTH_CHECK,
      },
      branding: this.fastify.config.branding,
    };
  }

  // GET /health - Health check
  async getHealth(_request: FastifyRequest, _reply: FastifyReply) {
    return {
      status: HEALTH_MESSAGES.STATUS_OK,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: SERVICE_INFO.NAME,
    };
  }

  // GET /ready - Readiness probe
  async getReadiness(_request: FastifyRequest, reply: FastifyReply) {
    try {
      // Ping database
      await this.fastify.prisma.$queryRaw`SELECT 1`;

      return {
        status: HEALTH_MESSAGES.STATUS_READY,
        timestamp: new Date().toISOString(),
        database: HEALTH_MESSAGES.DATABASE_CONNECTED,
      };
    } catch (error) {
      this.fastify.log.error(error, HEALTH_MESSAGES.READINESS_FAILED);
      return reply.serviceUnavailable(HEALTH_MESSAGES.DATABASE_DISCONNECTED);
    }
  }
}
