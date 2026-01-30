import { PLUGIN_LOG_MESSAGES } from "@constants";
import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * This plugin initializes Prisma Client and decorates Fastify with it
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
export default fp(async (fastify: FastifyInstance) => {
  // Parse log level from config (comma-separated string)
  const logLevels = fastify.config.database.logLevel
    .split(",")
    .map((level) => level.trim())
    .filter(Boolean);

  const prisma = new PrismaClient({
    log: logLevels.length > 0 ? (logLevels as any) : undefined,
  });

  // Test database connection
  try {
    await prisma.$connect();
    fastify.log.info(PLUGIN_LOG_MESSAGES.DATABASE_CONNECTED);
  } catch (error) {
    fastify.log.error(
      { err: error },
      PLUGIN_LOG_MESSAGES.DATABASE_CONNECTION_FAILED,
    );
    throw error;
  }

  // Decorate Fastify instance with Prisma client
  fastify.decorate("prisma", prisma);

  // Add hook to close Prisma connection when Fastify closes
  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
    fastify.log.info(PLUGIN_LOG_MESSAGES.DATABASE_DISCONNECTED);
  });
});

// Extend Fastify types to include Prisma
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
