import cookie from "@fastify/cookie";
import fp from "fastify-plugin";

/**
 * This plugin adds cookie support to Fastify
 */
export default fp(async (fastify) => {
  await fastify.register(cookie, {
    secret: fastify.config.security.cookieSecret,
    parseOptions: {
      httpOnly: true,
      secure: fastify.config.server.nodeEnv === "production",
      sameSite: "lax",
      path: "/",
    },
  });
});
