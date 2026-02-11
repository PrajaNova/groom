import rateLimit, { type RateLimitPluginOptions } from "@fastify/rate-limit";
import fp from "fastify-plugin";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-rate-limit
 */
export default fp<RateLimitPluginOptions>(async (fastify) => {
	fastify.register(rateLimit, {
		max: 100,
		timeWindow: "1 minute",
	});
});
