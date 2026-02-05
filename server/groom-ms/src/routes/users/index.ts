import { ROUTES } from "@constants";
import { UserController } from "@controllers/user.controller";
import { authGuard } from "@middleware/auth";
import { requireAnyRole } from "@middleware/role";
import { UserResponseSchema } from "@schemas/user.schema";
import { UserService } from "@services/user.service";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

export default async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify);
  const userController = new UserController(userService);

  // GET /users (Admin/SuperAdmin)
  fastify.get(
    "/", // Mounts at /api/users due to folder structure
    {
      preHandler: [authGuard, requireAnyRole(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        response: {
          200: z.array(UserResponseSchema),
        },
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      }),
    },
    async (request, reply) => userController.getAllUsers(request, reply),
  );
}
