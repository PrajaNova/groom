import type { User } from "@types";
import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

export class JaasService {
  constructor(private fastify: FastifyInstance) {}

  async generateToken(meetingId: string, user: User) {
    const { appId, apiKey, privateKey } = this.fastify.config.jitsi;

    if (!appId || !apiKey || !privateKey) {
      this.fastify.log.error("Missing JaaS credentials");
      throw new Error("JaaS credentials not configured");
    }

    const userContext = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      moderator: false,
    };

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 12; // 12 hours
    const nbf = now - 30;

    const payload = {
      context: {
        user: userContext,
        features: {
          livestreaming: userContext.moderator,
          recording: userContext.moderator,
          transcription: userContext.moderator,
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

    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      header: {
        kid: apiKey,
        typ: "JWT",
        alg: "RS256",
      },
    });

    return token;
  }
}
