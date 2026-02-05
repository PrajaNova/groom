import type { Role } from "@generated/client";
import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

export class JaasService {
  constructor(private fastify: FastifyInstance) {}

  generateToken(
    meetingId: string,
    user: { id: string; name: string; email: string; roles?: Role[] },
  ) {
    const { appId, apiKey, privateKey } = this.fastify.config.jitsi;

    if (!appId || !apiKey || !privateKey) {
      throw new Error("JaaS credentials not configured");
    }

    const userContext = user;
    const isModerator =
      user?.roles?.some((role) =>
        ["ADMIN", "SUPER_ADMIN"].includes(role.name),
      ) || false;

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 12; // 12 hours
    const nbf = now - 30;

    const payload = {
      context: {
        user: {
          ...userContext,
          moderator: isModerator,
        },
        features: {
          livestreaming: isModerator,
          recording: isModerator,
          transcription: isModerator,
          "outbound-call": false,
        },
      },
      aud: "jitsi",
      iss: "chat",
      sub: appId,
      room: `Groom_${meetingId}`,
      exp: exp,
      nbf: nbf,
    };

    // Replace literal \n with newlines if they are escaped in env
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

    return jwt.sign(payload, formattedPrivateKey, {
      algorithm: "RS256",
      header: {
        kid: apiKey,
        typ: "JWT",
        alg: "RS256",
      },
    });
  }
}
