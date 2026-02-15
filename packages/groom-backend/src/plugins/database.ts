import { PLUGIN_LOG_MESSAGES } from "@constants";
import { PrismaClient } from "@generated/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * This plugin initializes Prisma Client and decorates Fastify with it
 */
export default fp(async (fastify: FastifyInstance) => {
  const logLevels = fastify.config.database.logLevel
    .split(",")
    .map((level) => level.trim())
    .filter(Boolean);

  const prisma = new PrismaClient({
    log: logLevels.length > 0 ? (logLevels as any) : undefined,
  });

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

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
    fastify.log.info(PLUGIN_LOG_MESSAGES.DATABASE_DISCONNECTED);
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
