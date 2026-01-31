import type { Prisma, PrismaClient, ProviderAccount } from "@generated/client";
import type { UserResponse as User } from "@schemas/user.schema";
import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class UserService {
  private prisma: PrismaClient;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
  }

  // Helper to sanitize user object (remove password)
  private sanitize(user: any): User {
    const { password, ...rest } = user;
    return rest as User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    return user ? this.sanitize(user) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
    return user ? this.sanitize(user) : null;
  }

  async createUser(
    email: string,
    name: string,
    avatar?: string,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        id: nanoid(),
        email,
        name,
        avatar: avatar || null,
        roles: {
          connectOrCreate: {
            where: { name: "USER" },
            create: {
              id: nanoid(),
              name: "USER",
              description: "Default user role",
            },
          },
        },
      },
      include: { roles: true },
    });

    return this.sanitize(user);
  }

  // Create user with password for local authentication
  async createLocalUser(data: {
    email: string;
    name: string;
    password: string;
    avatar?: string;
  }): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        id: nanoid(),
        email: data.email,
        name: data.name,
        avatar: data.avatar || null,
        password: hashedPassword,
        roles: {
          connectOrCreate: {
            where: { name: "USER" },
            create: {
              id: nanoid(),
              name: "USER",
              description: "Default user role",
            },
          },
        },
      },
      include: { roles: true },
    });

    return this.sanitize(user);
  }

  // Verify password for local authentication
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return this.sanitize(user);
  }

  async linkProviderAccount(
    userId: string,
    provider: string,
    providerUserId: string,
    metadata: Record<string, any>,
  ): Promise<ProviderAccount> {
    const account = await this.prisma.providerAccount.create({
      data: {
        id: nanoid(),
        userId,
        provider,
        providerUserId,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    return {
      id: account.id,
      userId: account.userId,
      provider: account.provider,
      providerUserId: account.providerUserId,
      metadata: (account.metadata as Record<string, any>) ?? {},
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async findProviderAccount(
    provider: string,
    providerUserId: string,
  ): Promise<ProviderAccount | null> {
    const account = await this.prisma.providerAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
    });

    if (!account) return null;

    return {
      id: account.id,
      userId: account.userId,
      provider: account.provider,
      providerUserId: account.providerUserId,
      metadata: (account.metadata as Record<string, any>) ?? {},
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async findOrCreateUser(
    email: string,
    name: string,
    avatar: string,
    provider: string,
    providerUserId: string,
    metadata: Record<string, any>,
  ): Promise<User> {
    // First check if provider account exists
    const providerAccount = await this.findProviderAccount(
      provider,
      providerUserId,
    );

    if (providerAccount) {
      // Update metadata
      await this.prisma.providerAccount.update({
        where: { id: providerAccount.id },
        data: {
          metadata: metadata as Prisma.InputJsonValue,
        },
      });

      // Return existing user
      const user = await this.findUserById(providerAccount.userId);
      if (user) return user;
    }

    // Check if user exists by email
    let user = await this.findUserByEmail(email);

    if (!user) {
      // Create new user
      user = await this.createUser(email, name, avatar);
    }

    // Link provider account if not already linked
    if (!providerAccount) {
      await this.linkProviderAccount(
        user.id,
        provider,
        providerUserId,
        metadata,
      );
    }

    return user;
  }
}
