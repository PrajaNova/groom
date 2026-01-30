import type { Token } from "@types";
import { hashToken } from "@utils/generators";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class TokenService {
  constructor(private fastify: FastifyInstance) {}

  async storeToken(
    userId: string,
    provider: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
  ): Promise<Token> {
    const now = new Date();
    const expiresAt = expiresIn
      ? new Date(now.getTime() + expiresIn * 1000)
      : null;

    const hashedAccessToken = hashToken(accessToken);
    const hashedRefreshToken = refreshToken ? hashToken(refreshToken) : null;

    // Upsert token for this user/provider combination
    const token = await this.fastify.prisma.token.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      update: {
        accessToken: hashedAccessToken,
        refreshToken: hashedRefreshToken,
        expiresAt,
      },
      create: {
        id: nanoid(),
        userId,
        provider,
        accessToken: hashedAccessToken,
        refreshToken: hashedRefreshToken,
        expiresAt,
      },
    });

    return {
      id: token.id,
      userId: token.userId,
      provider: token.provider,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken ?? undefined,
      expiresAt: token.expiresAt ?? undefined,
      createdAt: token.createdAt,
    };
  }

  async getToken(userId: string, provider: string): Promise<Token | null> {
    const token = await this.fastify.prisma.token.findUnique({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
    });

    if (!token) return null;

    return {
      id: token.id,
      userId: token.userId,
      provider: token.provider,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken ?? undefined,
      expiresAt: token.expiresAt ?? undefined,
      createdAt: token.createdAt,
    };
  }

  async deleteToken(userId: string, provider: string): Promise<boolean> {
    try {
      await this.fastify.prisma.token.delete({
        where: {
          userId_provider: {
            userId,
            provider,
          },
        },
      });
      return true;
    } catch (_error) {
      // Token not found
      return false;
    }
  }

  async deleteUserTokens(userId: string): Promise<number> {
    const result = await this.fastify.prisma.token.deleteMany({
      where: { userId },
    });
    return result.count;
  }
}
