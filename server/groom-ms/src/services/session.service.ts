import type { Session } from "@schemas/session.schema";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export class SessionService {
  constructor(private fastify: FastifyInstance) {}

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + this.fastify.config.security.sessionExpiryHours,
    );

    const session = await this.fastify.prisma.session.create({
      data: {
        id: nanoid(),
        sessionId: nanoid(32),
        userId,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      id: session.id,
      sessionId: session.sessionId,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      device: session.device ?? undefined,
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const session = await this.fastify.prisma.session.findUnique({
      where: { sessionId },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await this.deleteSession(sessionId);
      return null;
    }

    return {
      id: session.id,
      sessionId: session.sessionId,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      device: session.device ?? undefined,
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
    };
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.fastify.prisma.session
      .delete({
        where: { sessionId },
      })
      .catch(() => {}); // Ignore if not found
  }

  async generateJWT(session: Session): Promise<string> {
    // In a real scenario, we might want to put more claims or user info
    // But keeping it minimal: just sessionId and userId is often enough if we look up session from DB
    // Or we can sign the user info directly.

    // Fetch user to put in token if needed, but here we just sign the session payload
    const user = await this.fastify.prisma.user.findUnique({
      where: { id: session.userId },
      include: { roles: true },
    });

    return this.fastify.jwt.sign({
      sessionId: session.sessionId,
      user: user, // Embed user info for quick access
    });
  }
}
