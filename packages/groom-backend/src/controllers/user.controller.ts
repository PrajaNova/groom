import {
  AUDIT_EVENTS,
  COOKIE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@constants";
import { UserUpdateSchema } from "@schemas/user.schema";
import { AuditService } from "@services/audit.service";
import { SessionService } from "@services/session.service";
import { UserService } from "@services/user.service";
import { getUserAgent } from "@utils/generators";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class UserController {
  constructor(private fastify: FastifyInstance) {}

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userService = new UserService(this.fastify);
    const providers = await userService.getUserProviders(request.user.id);

    // request.user is already hydrated with profile fields via authGuard -> findUserById -> sanitizeUserData
    return {
      user: request.user,
      linkedProviders: providers,
    };
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Validate body
    const updates = UserUpdateSchema.parse(request.body);

    const userService = new UserService(this.fastify);
    const updatedUser = await userService.updateUser(request.user.id, updates);

    if (!updatedUser) {
      return reply.internalServerError("Failed to update profile");
    }

    return {
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    };
  }

  async getSessions(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const sessionService = new SessionService(this.fastify);
    const sessions = await sessionService.getUserSessions(request.user.id);

    const currentSessionId = request.session?.sessionId;
    const sessionsWithCurrent = sessions.map((s) => ({
      ...s,
      isCurrent: s.sessionId === currentSessionId,
    }));

    return sessionsWithCurrent;
  }

  async revokeSession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { sessionId } = request.params;
    const sessionService = new SessionService(this.fastify);

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
      getUserAgent(request.headers),
    );

    return { success: true, message: SUCCESS_MESSAGES.SESSION_REVOKED };
  }

  async logoutAll(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const sessionService = new SessionService(this.fastify);
    const count = await sessionService.deleteUserSessions(request.user.id);

    reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);

    const auditService = new AuditService(this.fastify);
    await auditService.log(
      AUDIT_EVENTS.LOGOUT,
      { allSessions: true, count },
      request.user.id,
      request.ip,
      getUserAgent(request.headers),
    );

    return {
      success: true,
      message: `Logged out from ${count} session(s)`,
      count,
    };
  }
}
