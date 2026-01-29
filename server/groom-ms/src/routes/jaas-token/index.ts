import { FastifyPluginAsync } from "fastify";
import z from "zod";
import jwt from "jsonwebtoken";
import uuid from "uuid-random";

const TokenSchema = z.object({
  meetingId: z.string().min(1),
});

const jaasRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: z.infer<typeof TokenSchema> }>(
    "/",
    async function (request, reply) {
      const { meetingId } = request.body;

      const appId = process.env.JITSI_APP_ID;
      const apiKey = process.env.JITSI_API_KEY;
      const privateKey = process.env.JITSI_PRIVATE_KEY;

      if (!appId || !apiKey || !privateKey) {
        request.log.error("Missing JaaS credentials");
        reply.code(500);
        return { error: "JaaS credentials not configured" };
      }

      // Ideally we verify user session here. For now, we generate a guest token or minimal user context.
      // In a real flow, this endpoint would be guarded by auth middleware (which we haven't fully moved to gateway yet).
      // We'll mimic the "guest" or provided user context behavior.

      // TODO: Extract user from request headers if passed from gateway/frontend
      const userContext = {
        id: uuid(),
        name: "Guest User",
        email: "",
        avatar: "",
        moderator: false,
      };

      const now = Math.floor(Date.now() / 1000);
      const exp = now + 60 * 60 * 12;
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

      try {
        const token = jwt.sign(payload, privateKey, {
          algorithm: "RS256",
          header: {
            kid: apiKey,
            typ: "JWT",
            alg: "RS256",
          },
        });
        return { token };
      } catch (error) {
        request.log.error(error);
        reply.code(500);
        return { error: "Failed to generate token" };
      }
    },
  );
};

export default jaasRoutes;
