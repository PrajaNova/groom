import { ERROR_MESSAGES } from "@constants";
import type { FastifyReply, FastifyRequest } from "fastify";

export function roleGuard(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Ensure user is authenticated first (authGuard should run before this)
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Check if user has at least one of the allowed roles
    // We assume roles are attached to request.user (decrypted from JWT or fetched)
    // For now, let's fetch from DB or rely on JWT payload if we updated the type

    // In our current setup, request.user is the User object from DB (fetched in authGuard)
    // So we need to ensure authGuard fetches roles too, OR we rely on the JWT payload if meaningful.

    // Let's rely on the roles attached to the user object.
    // We need to update authGuard to include roles in the user fetch, OR fetch them here.
    // Ideally authGuard should fetch user WITH roles.

    const userRoles = request.user.roles || [];

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return reply.code(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "Insufficient permissions",
      });
    }
  };
}
