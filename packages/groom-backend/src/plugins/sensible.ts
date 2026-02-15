import sensible from "@fastify/sensible";
import fp from "fastify-plugin";

/**
 * This plugin adds sensible defaults and HTTP helpers
 */
export default fp(async (fastify) => {
  await fastify.register(sensible);

  fastify.log.info("Sensible plugin registered");
});
