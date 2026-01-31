import type { PrismaClient, Role } from "@generated/client";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class RoleService {
  private prisma: PrismaClient;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
  }

  async createRole(name: string, description?: string): Promise<Role> {
    const roleName = name.toUpperCase();
    return this.prisma.role.create({
      data: {
        id: nanoid(),
        name: roleName,
        description,
      },
    });
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { name: name.toUpperCase() },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.prisma.role.findMany({
      orderBy: { name: "asc" },
    });
  }

  async assignRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.getRoleByName(roleName);
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { id: role.id },
        },
      },
    });

    return true;
  }

  async revokeRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.getRoleByName(roleName);
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: { id: role.id },
        },
      },
    });

    return true;
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    return user?.roles.map((r) => r.name) || [];
  }
}
