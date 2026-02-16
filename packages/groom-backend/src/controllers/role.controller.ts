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

    // Only SUPER_ADMIN can create new role definitions
    const isSuperAdmin = request.user.roles?.includes("SUPER_ADMIN");
    if (!isSuperAdmin) {
      return reply.forbidden("Only Super Admin can create new roles");
    }

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

    // Admins can see all roles
    const roleService = new RoleService(this.fastify);
    return await roleService.getAllRoles();
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

    // Check hierarchy
    const requesterRoles = request.user.roles || [];
    const isSuperAdmin = requesterRoles.includes("SUPER_ADMIN");

    // Get the target role to check its name/level
    const targetRole = await roleService.getRoleById(roleId);

    if (!targetRole) {
      return reply.notFound("Role not found");
    }

    // Policy:
    // SUPER_ADMIN -> Can assign anything.
    // ADMIN -> Can assign USER role only. Cannot assign ADMIN or SUPER_ADMIN.
    if (!isSuperAdmin) {
      if (targetRole.name === "SUPER_ADMIN" || targetRole.name === "ADMIN") {
        return reply.forbidden("Admins cannot assign administrative roles");
      }
    }

    try {
      await roleService.assignRole(id, roleId);
      return { success: true, message: `Role assigned to user` };
    } catch (error: any) {
      return reply.badRequest(error.message);
    }
  }

  async revokeRole(
    request: FastifyRequest<{
      Params: { id: string; roleId: string };
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id, roleId } = request.params;
    const requesterRoles = request.user.roles || [];
    const isSuperAdmin = requesterRoles.includes("SUPER_ADMIN");

    const roleService = new RoleService(this.fastify);
    const targetRole = await roleService.getRoleById(roleId);

    if (!targetRole) {
      return reply.notFound("Role not found");
    }

    // Policy:
    // SUPER_ADMIN -> Can revoke anything.
    // ADMIN -> Can revoke USER role only. Cannot revoke ADMIN or SUPER_ADMIN.
    if (!isSuperAdmin) {
      if (targetRole.name === "SUPER_ADMIN" || targetRole.name === "ADMIN") {
        return reply.forbidden("Admins cannot revoke administrative roles");
      }
    }

    try {
      await roleService.revokeRole(id, roleId);
      return { success: true, message: `Role revoked from user` };
    } catch (error: any) {
      return reply.badRequest(error.message);
    }
  }
}
