import { PrismaClient } from "@generated/client";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
};

export default fp(prismaPlugin);

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
