import cookie from "@fastify/cookie";
import fp from "fastify-plugin";

/**
 * This plugin adds cookie support to Fastify
 */
export default fp(async (fastify) => {
  const nodeEnv = fastify.config.server.nodeEnv;
  const isDev = nodeEnv === "development" || nodeEnv === "test";
  const isProdLike = !isDev;
  
  await fastify.register(cookie, {
    secret: fastify.config.security.cookieSecret,
    parseOptions: {
      httpOnly: true,
      secure: isProdLike,
      sameSite: isProdLike ? "none" : "lax",
      path: "/",
    },
  });
});
