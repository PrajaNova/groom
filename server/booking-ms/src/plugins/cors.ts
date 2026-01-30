import cors, { type FastifyCorsOptions } from "@fastify/cors";
import fp from "fastify-plugin";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: true, // Allow all for now, restrict in production
    credentials: true,
  });
});
