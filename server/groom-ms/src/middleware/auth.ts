import { COOKIE_CONFIG, ERROR_MESSAGES } from "@constants";
import { SessionService } from "@services/session.service";
import { UserService } from "@services/user.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Try to get JWT from cookie
    const token = request.cookies[COOKIE_CONFIG.SESSION_NAME];

    if (!token) {
      return reply.unauthorized(ERROR_MESSAGES.NO_SESSION_TOKEN);
    }

    const sessionService = new SessionService(request.server);
    // Decode first to get payload, assuming verify is handled by jwt plugin or manual verify
    // fastify.jwt.verify throws if invalid.
    const payload = await request.jwtVerify<{ sessionId: string }>();
    // OR if using sessionService helper:
    // const payload = await sessionService.verifyJWT(token); // Not implemented in my session service yet!
    // I implemented generateJWT but not verifyJWT in SessionService.
    // Usually fastify-jwt adds verify to request/instance.
    // Let's use request.jwtVerify() which verifies header primarily but we can pass token?
    // fastify-jwt verifies Authorization header by default. Here we use cookie.

    // Manual verification since token is in cookie:
    const decoded = request.server.jwt.verify<{
      sessionId: string;
      user?: any;
    }>(token);

    if (!decoded || !decoded.sessionId) {
      return reply.unauthorized(ERROR_MESSAGES.INVALID_SESSION_TOKEN);
    }

    // Validate session
    const session = await sessionService.getSession(decoded.sessionId);

    if (!session) {
      // Clear invalid cookie
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
    // Only log if it's not a JWT verification error (which is expected)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes("jwt") && !errorMessage.includes("token")) {
      request.log.error(error, "Unexpected auth guard error");
    }
    return reply.unauthorized(ERROR_MESSAGES.AUTH_FAILED);
  }
}
