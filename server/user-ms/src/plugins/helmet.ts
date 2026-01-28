import helmet from "@fastify/helmet";
import fp from "fastify-plugin";

/**
 * This plugin adds security headers via Helmet
 * @see https://github.com/fastify/fastify-helmet
 */
export default fp(async (fastify) => {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });
});
