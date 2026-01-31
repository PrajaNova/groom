import { COOKIE_CONFIG, ERROR_MESSAGES } from "@constants";
import { SessionService } from "@services/session.service";
import { UserService } from "@services/user.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.cookies[COOKIE_CONFIG.SESSION_NAME];
    if (!token) {
      return reply.unauthorized(ERROR_MESSAGES.NO_SESSION_TOKEN);
    }
    const sessionService = new SessionService(request.server);
    const decoded = request.server.jwt.verify<{
      sessionId: string;
      user?: any;
    }>(token);
    if (!decoded || !decoded.sessionId) {
      return reply.unauthorized(ERROR_MESSAGES.INVALID_SESSION_TOKEN);
    }
    const session = await sessionService.getSession(decoded.sessionId);
    if (!session) {
      reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);
      return reply.unauthorized(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    // Get user
    const userService = new UserService(request.server);
    const user = await userService.findUserById(session.userId);

    if (!user) {
      return reply.unauthorized(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Attach to request
    request.user = user;
    request.session = session;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes("jwt") && !errorMessage.includes("token")) {
      request.log.error(error, "Unexpected auth guard error");
    }
    return reply.unauthorized(ERROR_MESSAGES.AUTH_FAILED);
  }
}
