// Load environment variables first
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import "dotenv/config";
import { join } from "node:path";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyServerOptions,
} from "fastify";

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
  trustProxy: true,
  requestIdHeader: "x-request-id",
  requestIdLogLabel: "reqId",
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify: FastifyInstance,
  opts?: AppOptions,
): Promise<void> => {
  // Register plugins first (auto-loads from plugins directory)
  await fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // Register routes with /api prefix
  await fastify.register(
    async (instance) => {
      await instance.register(AutoLoad, {
        dir: join(__dirname, "routes"),
        options: opts,
      });
    },
    { prefix: "/api" },
  );
};

export default app;
export { app, options };
