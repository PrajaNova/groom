import { ERROR_MESSAGES } from "@constants";
import { RoleService } from "@services/role.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class RoleController {
  constructor(private fastify: FastifyInstance) {}

  async createRole(
    request: FastifyRequest<{ Body: { name: string; description?: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }
    // In a real app, you'd check for ADMIN role here

    const { name, description } = request.body;
    if (!name) {
      return reply.badRequest("Role name is required");
    }

    try {
      const roleService = new RoleService(this.fastify);
      const role = await roleService.createRole({ name, description });
      return reply.code(201).send(role);
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.conflict("Role already exists");
      }
      return reply.internalServerError(error.message);
    }
  }

  async getRoles(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const roleService = new RoleService(this.fastify);
    const roles = await roleService.getAllRoles();
    return roles;
  }

  async assignRole(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { roleId: string };
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id } = request.params;
    const { roleId } = request.body;

    if (!roleId) {
      return reply.badRequest("Role ID is required");
    }

    const roleService = new RoleService(this.fastify);
    try {
      await roleService.assignRole(id, roleId);
      return { success: true, message: `Role ${roleId} assigned to user` };
    } catch (error: any) {
      return reply.badRequest(error.message);
    }
  }
}
