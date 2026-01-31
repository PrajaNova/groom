import { PLUGIN_LOG_MESSAGES } from "@constants";
import { PrismaClient } from "@generated/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * This plugin initializes Prisma Client and decorates Fastify with it
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
export default fp(async (fastify: FastifyInstance) => {
  const { logEnabled, logLevel } = fastify.config.database;
  const prisma = new PrismaClient({
    log: logEnabled ? logLevel : [],
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
