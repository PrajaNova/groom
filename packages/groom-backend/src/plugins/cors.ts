import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * This plugin adds CORS support with dynamic origin validation
 */
export default fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(cors, {
      origin: (origin, callback) => {
        const allowedOrigins = fastify.config.security.allowedOrigins;
        const isLocalDev = fastify.config.server.nodeEnv === "development";

        if (!origin) {
          callback(null, true);
          return;
        }

        if (
          isLocalDev &&
          (origin.includes("localhost") || origin.includes("127.0.0.1"))
        ) {
          callback(null, true);
          return;
        }

        if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"), false);
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Set-Cookie"],
    });

    fastify.log.info("CORS plugin registered");
  },
  {
    name: "cors-plugin",
    dependencies: ["config-plugin"],
  },
);
