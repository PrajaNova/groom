import { ERROR_MESSAGES, HTTP_STATUS } from "@constants";
import type { FastifyReply, FastifyRequest } from "fastify";

export function roleGuard(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Ensure user is authenticated first (authGuard should run before this)
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Check if user has at least one of the allowed roles
    // authGuard now fetches user WITH roles and sanitizeUserData includes role names
    const userRoles = request.user.roles || [];

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return reply.code(HTTP_STATUS.FORBIDDEN).send({
        statusCode: HTTP_STATUS.FORBIDDEN,
        error: "Forbidden",
        message: ERROR_MESSAGES.FORBIDDEN,
      });
    }
  };
}
