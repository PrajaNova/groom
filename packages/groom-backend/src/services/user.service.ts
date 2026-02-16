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

  /**
   * Helper to include profile and roles in user queries
   */
  private get defaultIncludes() {
    return {
      profile: true,
      roles: true,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
      include: this.defaultIncludes,
    });
    return user ? sanitizeUserData(user) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id },
      include: this.defaultIncludes,
    });
    return user ? sanitizeUserData(user) : null;
  }

  /**
   * Find user by ID with roles included (for authGuard/RBAC)
   */
  async findUserByIdWithRoles(id: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id },
      include: this.defaultIncludes,
    });
    return user ? sanitizeUserData(user) : null;
  }

  async createUser(
    email: string,
    name: string,
    avatar?: string,
  ): Promise<User> {
    // Import RoleService inline to avoid circular dependency issues
    const { RoleService } = await import("./role.service");
    const roleService = new RoleService(this.fastify);
    const userRole = await roleService.ensureDefaultUserRole();

    const user = await this.fastify.prisma.user.create({
      data: {
        id: nanoid(),
        email,
        profile: {
          create: {
            name,
            avatar: avatar || null,
          },
        },
        roles: {
          connect: { id: userRole.id },
        },
      },
      include: this.defaultIncludes,
    });

    return sanitizeUserData(user);
  }

  async createLocalUser(data: UserCreate): Promise<User> {
    const validated = UserCreateSchema.parse(data);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validated.password, saltRounds);

    // Import RoleService inline to avoid circular dependency issues
    const { RoleService } = await import("./role.service");
    const roleService = new RoleService(this.fastify);
    const userRole = await roleService.ensureDefaultUserRole();

    const user = await this.fastify.prisma.user.create({
      data: {
        id: nanoid(),
        email: validated.email,
        password: hashedPassword,
        profile: {
          create: {
            name: validated.name,
            avatar: validated.avatar || null,
          },
        },
        roles: {
          connect: { id: userRole.id },
        },
      },
      include: this.defaultIncludes,
    });

    return sanitizeUserData(user);
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
      include: this.defaultIncludes,
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
    const validated = UserUpdateSchema.parse(updates);
    const {
      name,
      avatar,
      bio,
      phone,
      dateOfBirth,
      gender,
      street,
      city,
      state,
      zipCode,
      country,
      ...otherUpdates
    } = validated;

    // Check if any profile updates are present
    const hasProfileUpdates = [
      name,
      avatar,
      bio,
      phone,
      dateOfBirth,
      gender,
      street,
      city,
      state,
      zipCode,
      country,
    ].some((v) => v !== undefined);

    try {
      const user = await this.fastify.prisma.user.update({
        where: { id },
        data: {
          ...otherUpdates, // email, password if allowed (usually separate flow)
          ...(hasProfileUpdates && {
            profile: {
              update: {
                name,
                avatar,
                bio,
                phone,
                dateOfBirth,
                gender,
                street,
                city,
                state,
                zipCode,
                country,
              },
            },
          }),
        },
        include: this.defaultIncludes,
      });
      return sanitizeUserData(user);
    } catch (_error) {
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
    const providerAccount = await this.findProviderAccount(
      provider,
      providerUserId,
    );

    if (providerAccount) {
      await this.fastify.prisma.providerAccount.update({
        where: { id: providerAccount.id },
        data: {
          metadata: metadata as Prisma.InputJsonValue,
        },
      });

      const user = await this.findUserById(providerAccount.userId);
      if (user) return user;
    }

    let user = await this.findUserByEmail(email);

    if (!user) {
      user = await this.createUser(email, name, avatar);
    }

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
