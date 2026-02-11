import helmet, { type FastifyHelmetOptions } from "@fastify/helmet";
import fp from "fastify-plugin";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-helmet
 */
export default fp<FastifyHelmetOptions>(async (fastify) => {
	fastify.register(helmet);
});
