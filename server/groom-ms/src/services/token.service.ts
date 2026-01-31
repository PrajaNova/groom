import type { PrismaClient } from "@generated/client";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class TokenService {
  private prisma: PrismaClient;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
  }

  async storeToken(
    userId: string,
    provider: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
  ) {
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000)
      : undefined;

    // Use upsert to handle existing tokens
    return await this.prisma.token.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      update: {
        accessToken, // In prod, encrypt this!
        refreshToken, // In prod, encrypt this!
        expiresAt,
        updatedAt: new Date(), // Manually update implies updated logic if schema doesn't have updatedAt
      },
      create: {
        id: nanoid(),
        userId,
        provider,
        accessToken, // In prod, encrypt this!
        refreshToken, // In prod, encrypt this!
        expiresAt,
      },
    });
  }

  async getToken(userId: string, provider: string) {
    return await this.prisma.token.findUnique({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
    });
  }

  async deleteToken(userId: string, provider: string) {
    return await this.prisma.token.delete({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
    });
  }
}
