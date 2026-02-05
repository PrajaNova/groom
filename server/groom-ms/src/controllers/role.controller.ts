import { ROUTES } from "@constants";
import type {
  AssignRoles,
  RevokeRoles,
  RoleCreate,
  RoleUpdate,
} from "@schemas/role.schema";
import { RoleService } from "@services/role.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export class RoleController {
  private roleService: RoleService;

  constructor(fastify: any) {
    this.roleService = new RoleService(fastify);
  }

  async getAllRoles(request: FastifyRequest, reply: FastifyReply) {
    const roles = await this.roleService.getAllRoles();
    return reply.send(roles);
  }

  async getUserRoles(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const roles = await this.roleService.getUserRoles(id);
    return reply.send(roles);
  }

  async addRoles(
    request: FastifyRequest<{ Body: AssignRoles }>,
    reply: FastifyReply,
  ) {
    const { userId, roleIds } = request.body;
    await this.roleService.assignRoles(userId, roleIds);
    return reply.send({
      success: true,
      message: "Roles assigned successfully",
    });
  }

  async removeRoles(
    request: FastifyRequest<{ Body: RevokeRoles }>,
    reply: FastifyReply,
  ) {
    const { userId, roleIds } = request.body;
    await this.roleService.revokeRoles(userId, roleIds);
    return reply.send({ success: true, message: "Roles removed successfully" });
  }

  async createRole(
    request: FastifyRequest<{ Body: RoleCreate }>,
    reply: FastifyReply,
  ) {
    const { name, description } = request.body;
    const role = await this.roleService.createRole(name, description);
    return reply.code(201).send(role);
  }

  async deleteRole(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    await this.roleService.deleteRole(id);
    return reply.send({ success: true, message: "Role deleted successfully" });
  }

  async updateRole(
    request: FastifyRequest<{ Params: { id: string }; Body: RoleUpdate }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const { name } = request.body;
    const role = await this.roleService.updateRole(id, name);
    return reply.send(role);
  }
}
