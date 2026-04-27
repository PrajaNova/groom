import cookie from "@fastify/cookie";
import fp from "fastify-plugin";

/**
 * This plugin adds cookie support to Fastify
 */
export default fp(async (fastify) => {
  const isProd = fastify.config.server.nodeEnv === "production";
  
  await fastify.register(cookie, {
    secret: fastify.config.security.cookieSecret,
    parseOptions: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    },
  });
});
