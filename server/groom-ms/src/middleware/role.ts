import { ERROR_MESSAGES } from "@constants";
import type { FastifyReply, FastifyRequest } from "fastify";

export const requireRole = (roleName: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userRoles = request.user.roles?.map((r) => r.name) || [];
    if (userRoles.includes("SUPER_ADMIN")) {
      return;
    }

    if (!userRoles.includes(roleName)) {
      return reply.forbidden(`Insufficient permissions: Requires ${roleName}`);
    }
  };
};

export const requireAnyRole = (roleNames: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userRoles = request.user.roles?.map((r) => r.name) || [];
    if (userRoles.includes("SUPER_ADMIN")) {
      return;
    }
    const hasRole = roleNames.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return reply.forbidden(
        `Insufficient permissions: Requires one of [${roleNames.join(", ")}]`,
      );
    }
  };
};
