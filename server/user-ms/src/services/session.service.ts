import type { Session } from "@types";
import {
  calculateSessionExpiry,
  extractDeviceInfo,
  generateSessionId,
  isSessionExpired,
} from "@utils/generators";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class SessionService {
  constructor(private fastify: FastifyInstance) {}

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<Session> {
    const sessionId = generateSessionId();
    const expiresAt = calculateSessionExpiry(
      this.fastify.config.security.sessionExpiryHours,
    );

    const session = await this.fastify.prisma.session.create({
      data: {
        id: nanoid(),
        sessionId,
        userId,
        expiresAt,
        device: extractDeviceInfo(userAgent),
        userAgent,
        ipAddress,
      },
    });

    return {
      sessionId: session.sessionId,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      device: session.device ?? undefined,
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async findSession(sessionId: string): Promise<Session | null> {
    const session = await this.fastify.prisma.session.findUnique({
      where: { sessionId },
    });

    if (!session) return null;

    return {
      sessionId: session.sessionId,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      device: session.device ?? undefined,
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async validateSession(sessionId: string): Promise<Session | null> {
    const session = await this.findSession(sessionId);

    if (!session) return null;

    if (isSessionExpired(session.expiresAt)) {
      await this.deleteSession(sessionId);
      return null;
    }

    return session;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions = await this.fastify.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Filter out expired sessions
    const validSessions = sessions.filter(
      (s) => !isSessionExpired(s.expiresAt),
    );

    // Clean up expired ones
    const expiredSessionIds = sessions
      .filter((s) => isSessionExpired(s.expiresAt))
      .map((s) => s.sessionId);

    if (expiredSessionIds.length > 0) {
      await this.fastify.prisma.session.deleteMany({
        where: {
          sessionId: { in: expiredSessionIds },
        },
      });
    }

    return validSessions.map((s) => ({
      sessionId: s.sessionId,
      userId: s.userId,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      device: s.device ?? undefined,
      userAgent: s.userAgent ?? undefined,
      ipAddress: s.ipAddress ?? undefined,
    }));
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await this.fastify.prisma.session.delete({
        where: { sessionId },
      });
      return true;
    } catch (_error) {
      // Session not found
      return false;
    }
  }

  async deleteUserSessions(userId: string): Promise<number> {
    const result = await this.fastify.prisma.session.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  async rotateSession(oldSessionId: string): Promise<Session | null> {
    const oldSession = await this.findSession(oldSessionId);

    if (!oldSession) return null;

    // Create new session
    const newSession = await this.createSession(
      oldSession.userId,
      oldSession.userAgent,
      oldSession.ipAddress,
    );

    // Delete old session
    await this.deleteSession(oldSessionId);

    return newSession;
  }

  async generateJWT(session: Session): Promise<string> {
    // Fetch user roles to include in JWT
    const user = await this.fastify.prisma.user.findUnique({
      where: { id: session.userId },
      include: { roles: true },
    });

    const roles = user?.roles.map((r) => r.name) || [];

    return await this.fastify.jwt.sign({
      sessionId: session.sessionId,
      userId: session.userId,
      roles,
    });
  }

  async verifyJWT(
    token: string,
  ): Promise<{ sessionId: string; userId: string } | null> {
    try {
      const decoded = this.fastify.jwt.verify(token);
      return decoded as { sessionId: string; userId: string };
    } catch (_error) {
      return null;
    }
  }
}
