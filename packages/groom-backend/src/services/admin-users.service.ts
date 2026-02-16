import type { User } from "@types";
import { sanitizeUserData } from "@utils/generators";
import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";

export class AdminUsersService {
  constructor(private fastify: FastifyInstance) {}

  private get defaultIncludes() {
    return {
      profile: true,
      roles: true,
      _count: {
        select: {
          bookings: true,
          sessions: true,
        },
      },
    };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.fastify.prisma.user.findMany({
      include: this.defaultIncludes,
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => sanitizeUserData(user));
  }

  async getUserWithDetails(id: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id },
      include: this.defaultIncludes,
    });

    return user ? sanitizeUserData(user) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      // Prisma will cascade delete related records (profile, sessions, etc.)
      await this.fastify.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      this.fastify.log.error(error, `Failed to delete user ${id}`);
      return false;
    }
  }

  async resetUserPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await this.fastify.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      // Invalidate all user sessions
      await this.fastify.prisma.session.deleteMany({
        where: { userId: id },
      });

      return true;
    } catch (error) {
      this.fastify.log.error(error, `Failed to reset password for user ${id}`);
      return false;
    }
  }
}
