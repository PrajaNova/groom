import {
  HTTP_STATUS,
  MISC,
  RATE_LIMIT_CONFIG,
  RATE_LIMIT_MESSAGES,
} from "@constants";
import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";

/**
 * This plugin adds rate limiting to protect endpoints
 * @see https://github.com/fastify/fastify-rate-limit
 */
export default fp(
  async (fastify) => {
    await fastify.register(rateLimit, {
      max: fastify.config.rateLimit.max,
      timeWindow: fastify.config.rateLimit.timeWindow,
      cache: RATE_LIMIT_CONFIG.CACHE_SIZE,
      allowList: [MISC.LOCALHOST],
      skipOnError: RATE_LIMIT_CONFIG.SKIP_ON_ERROR,
      keyGenerator: (request) => {
        return request.ip || MISC.UNKNOWN;
      },
      errorResponseBuilder: (_, context) => {
        return {
          statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
          error: RATE_LIMIT_MESSAGES.TOO_MANY_REQUESTS,
          message: `${RATE_LIMIT_MESSAGES.RATE_LIMIT_EXCEEDED} ${Math.ceil(context.ttl / 1000)} ${RATE_LIMIT_MESSAGES.SECONDS_SUFFIX}`,
        };
      },
    });
  },
  {
    name: RATE_LIMIT_CONFIG.PLUGIN_NAME,
    dependencies: [RATE_LIMIT_CONFIG.DEPENDENCY],
  },
);
