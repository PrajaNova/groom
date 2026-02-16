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
    const payload = await sessionService.verifyJWT(token);

    if (!payload) {
      return reply.unauthorized(ERROR_MESSAGES.INVALID_SESSION_TOKEN);
    }

    // Validate session
    const session = await sessionService.validateSession(payload.sessionId);

    if (!session) {
      reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);
      return reply.unauthorized(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    // Get user WITH roles so roleGuard works
    const userService = new UserService(request.server);
    const user = await userService.findUserByIdWithRoles(session.userId);

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

export async function optionalAuth(request: FastifyRequest, _: FastifyReply) {
  try {
    const token = request.cookies[COOKIE_CONFIG.SESSION_NAME];

    if (!token) return;

    const sessionService = new SessionService(request.server);
    const payload = await sessionService.verifyJWT(token);

    if (!payload) return;

    const session = await sessionService.validateSession(payload.sessionId);
    if (!session) return;

    const userService = new UserService(request.server);
    const user = await userService.findUserByIdWithRoles(session.userId);

    if (user) {
      request.user = user;
      request.session = session;
    }
  } catch (error) {
    request.log.debug(error, "Optional auth failed");
  }
}
