import sensible from "@fastify/sensible";
import fp from "fastify-plugin";

/**
 * This plugin adds sensible defaults and HTTP helpers
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify) => {
  await fastify.register(sensible);

  fastify.log.info("Sensible plugin registered");
});
