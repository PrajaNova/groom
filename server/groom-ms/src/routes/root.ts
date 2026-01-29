import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });

  fastify.get("/health", async function (request, reply) {
    return { status: "ok", service: "groom-ms" };
  });
};

export default root;
