import type { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get("/", async (_request, _reply) => ({ root: true }));

  fastify.get("/health", async (_request, _reply) => ({
    status: "ok",
    service: "groom-ms",
  }));
};

export default root;
