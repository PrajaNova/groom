import {
  AUDIT_EVENTS,
  COOKIE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@constants";
import { AuditService } from "@services/audit.service";
import { SessionService } from "@services/session.service";
import { UserService } from "@services/user.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class UserController {
  constructor(private fastify: FastifyInstance) {}

  // Helper to extract user-agent header safely
  private getUserAgent(headers: FastifyRequest["headers"]): string | undefined {
    const userAgent = headers["user-agent"];
    if (Array.isArray(userAgent)) {
      return userAgent[0];
    }
    return userAgent;
  }

  // GET /me - Get current user profile
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userService = new UserService(this.fastify);
    const providers = await userService.getUserProviders(request.user.id);

    return {
      user: request.user,
      linkedProviders: providers,
    };
  }

  // GET /sessions - Get all active sessions for current user
  async getSessions(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const sessionService = new SessionService(this.fastify);
    const sessions = await sessionService.getUserSessions(request.user.id);

    // Mark current session
    const currentSessionId = request.session?.sessionId;
    const sessionsWithCurrent = sessions.map((s) => ({
      ...s,
      isCurrent: s.sessionId === currentSessionId,
    }));

    return sessionsWithCurrent;
  }

  // DELETE /sessions/:sessionId - Revoke a specific session
  async revokeSession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { sessionId } = request.params;
    const sessionService = new SessionService(this.fastify);

    // Verify session belongs to current user
    const session = await sessionService.findSession(sessionId);
    if (!session || session.userId !== request.user.id) {
      return reply.notFound(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }

    await sessionService.deleteSession(sessionId);

    const auditService = new AuditService(this.fastify);
    await auditService.log(
      AUDIT_EVENTS.SESSION_REVOKE,
      { sessionId },
      request.user.id,
      request.ip,
      this.getUserAgent(request.headers),
    );

    return { success: true, message: SUCCESS_MESSAGES.SESSION_REVOKED };
  }

  // DELETE /sessions - Logout from all sessions
  async logoutAll(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const sessionService = new SessionService(this.fastify);
    const count = await sessionService.deleteUserSessions(request.user.id);

    // Clear current session cookie
    reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);

    const auditService = new AuditService(this.fastify);
    await auditService.log(
      AUDIT_EVENTS.LOGOUT,
      { allSessions: true, count },
      request.user.id,
      request.ip,
      this.getUserAgent(request.headers),
    );

    return {
      success: true,
      message: `Logged out from ${count} session(s)`,
      count,
    };
  }
}
