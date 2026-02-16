import type { Role } from "@generated/client";
import { type RoleCreate, RoleCreateSchema } from "@schemas/role.schema";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class RoleService {
  constructor(private fastify: FastifyInstance) {}

  async createRole(data: RoleCreate): Promise<Role> {
    const validated = RoleCreateSchema.parse(data);

    const roleName = validated.name.toUpperCase();
    return this.fastify.prisma.role.create({
      data: {
        id: nanoid(),
        name: roleName,
        description: validated.description,
      },
    });
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return this.fastify.prisma.role.findUnique({
      where: { name: name.toUpperCase() },
    });
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.fastify.prisma.role.findUnique({
      where: { id },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.fastify.prisma.role.findMany({
      orderBy: { name: "asc" },
    });
  }

  async assignRole(userId: string, roleId: string): Promise<boolean> {
    const role = await this.getRoleById(roleId);

    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    try {
      await this.fastify.prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            connect: { id: roleId },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error(`User with ID ${userId} not found`);
      }
      throw error;
    }

    return true;
  }

  async revokeRole(userId: string, roleId: string): Promise<boolean> {
    const role = await this.getRoleById(roleId);

    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    try {
      await this.fastify.prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            disconnect: { id: roleId },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error(`User with ID ${userId} not found`);
      }
      throw error;
    }

    return true;
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    return user?.roles.map((r) => r.name) || [];
  }

  /**
   * Ensure default USER role exists and return it
   */
  async ensureDefaultUserRole(): Promise<Role> {
    const userRole = await this.getRoleByName("USER");
    
    if (userRole) {
      return userRole;
    }

    // Create USER role if it doesn't exist
    return this.fastify.prisma.role.create({
      data: {
        id: nanoid(),
        name: "USER",
        description: "Default user role",
      },
    });
  }
}
