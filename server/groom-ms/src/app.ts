import { join } from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import type { FastifyPluginAsync, FastifyServerOptions } from "fastify";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const options: AppOptions = {
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Register Plugins (Prisma, etc) via autoload
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // Register Routes via autoload
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: { ...opts, prefix: "/api" }, // Add /api prefix
  });

  // Register CORS
  fastify.register(import("@fastify/cors"), {
    origin: true, // Allow all for now, or match *
  });

  // Register Helmet
  fastify.register(import("@fastify/helmet"), {
    global: true,
  });
};

export default app;
export { app, options };
