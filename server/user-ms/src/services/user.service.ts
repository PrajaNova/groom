import type { Prisma } from "@generated/client";
import {
  type UserCreate,
  UserCreateSchema,
  type UserUpdate,
  UserUpdateSchema,
} from "@schemas/user.schema";
import type { ProviderAccount, User } from "@types";
import { sanitizeUserData } from "@utils/generators";
import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class UserService {
  constructor(private fastify: FastifyInstance) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
    });
    return user ? sanitizeUserData(user) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id },
    });
    return user ? sanitizeUserData(user) : null;
  }

  async createUser(
    email: string,
    name: string,
    avatar?: string,
  ): Promise<User> {
    const user = await this.fastify.prisma.user.create({
      data: {
        id: nanoid(),
        email,
        name,
        avatar: avatar || null,
      },
    });

    return sanitizeUserData(user);
  }

  // Create user with password for local authentication
  async createLocalUser(data: UserCreate): Promise<User> {
    // Validate input with Zod schema
    const validated = UserCreateSchema.parse(data);

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validated.password, saltRounds);

    const user = await this.fastify.prisma.user.create({
      data: {
        id: nanoid(),
        email: validated.email,
        name: validated.name,
        avatar: validated.avatar || null,
        password: hashedPassword,
      },
    });

    return sanitizeUserData(user);
  }

  // Verify password for local authentication
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return sanitizeUserData(user);
  }

  async updateUser(id: string, updates: UserUpdate): Promise<User | null> {
    // Validate input with Zod schema
    const validated = UserUpdateSchema.parse(updates);

    try {
      const user = await this.fastify.prisma.user.update({
        where: { id },
        data: validated,
      });
      return sanitizeUserData(user);
    } catch (_error) {
      // User not found
      return null;
    }
  }

  async linkProviderAccount(
    userId: string,
    provider: string,
    providerUserId: string,
    metadata: Record<string, any>,
  ): Promise<ProviderAccount> {
    const account = await this.fastify.prisma.providerAccount.create({
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
    const account = await this.fastify.prisma.providerAccount.findUnique({
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

  async getUserProviders(userId: string): Promise<string[]> {
    const accounts = await this.fastify.prisma.providerAccount.findMany({
      where: { userId },
      select: { provider: true },
    });

    return accounts.map((acc) => acc.provider);
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
      await this.fastify.prisma.providerAccount.update({
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
