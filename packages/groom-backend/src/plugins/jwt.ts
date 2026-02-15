import jwt from "@fastify/jwt";
import fp from "fastify-plugin";

/**
 * This plugin adds JWT support for session tokens
 */
export default fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: fastify.config.security.jwtSecret,
    sign: {
      expiresIn: `${fastify.config.security.sessionExpiryHours}h`,
    },
    cookie: {
      cookieName: "session",
      signed: true,
    },
  });

  fastify.log.info("JWT plugin registered successfully");
});
