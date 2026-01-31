import { authGuard } from "@middleware/auth";
import { requireRole } from "@middleware/role";
import {
  ErrorSchema,
  IdParamSchema,
  SuccessResponseSchema,
} from "@schemas/common";
import { UserService } from "@services/user.service";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  const userService = new UserService(fastify);

  // Promote User to Admin
  fastify.post(
    "/users/:id/promote",
    {
      preHandler: [authGuard, requireRole("SUPER_ADMIN")],
      schema: {
        params: IdParamSchema,
        response: {
          200: SuccessResponseSchema,
          403: ErrorSchema,
          404: ErrorSchema,
        },
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const adminRole = await fastify.prisma.role.findUnique({
        where: { name: "ADMIN" },
      });

      if (!adminRole) {
        return reply.internalServerError("ADMIN role configuration missing");
      }

      try {
        // Assign ADMIN role
        // Since we don't have RoleService available in context easily (or just use Prisma directly)
        // But we should use services if possible.
        // I'll simply update via User Service if it exposes update, or direct prisma

        // Checking if user exists
        const user = await userService.findUserById(id);
        if (!user) {
          return reply.notFound("User not found");
        }

        await fastify.prisma.user.update({
          where: { id },
          data: {
            roles: {
              connect: { id: adminRole.id },
            },
          },
        });

        return { success: true, message: "User promoted to Admin" };
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError("Failed to promote user");
      }
    },
  );
};

export default adminRoutes;
