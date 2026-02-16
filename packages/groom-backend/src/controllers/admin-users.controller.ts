import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants";
import { AdminUsersService } from "@services/admin-users.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class AdminUsersController {
  constructor(private fastify: FastifyInstance) {}

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const adminUsersService = new AdminUsersService(this.fastify);
    const users = await adminUsersService.getAllUsers();

    return users;
  }

  async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const adminUsersService = new AdminUsersService(this.fastify);
    const user = await adminUsersService.getUserWithDetails(request.params.id);

    if (!user) {
      return reply.notFound("User not found");
    }

    return { user };
  }

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id } = request.params;

    // Prevent admin from deleting themselves
    if (id === request.user.id) {
      return reply.forbidden("Cannot delete your own account");
    }

    const adminUsersService = new AdminUsersService(this.fastify);
    const success = await adminUsersService.deleteUser(id);

    if (!success) {
      return reply.notFound("User not found");
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  }

  async resetPassword(
    request: FastifyRequest<{ Params: { id: string }; Body: { newPassword: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id } = request.params;
    const { newPassword } = request.body;

    const adminUsersService = new AdminUsersService(this.fastify);
    const success = await adminUsersService.resetUserPassword(id, newPassword);

    if (!success) {
      return reply.notFound("User not found");
    }

    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}
