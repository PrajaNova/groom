import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/**
 * Custom error handler to prevent @fastify/sensible HTTP errors
 * from being logged as server errors (they're expected client errors)
 */
export default fp(async (fastify) => {
  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      if (
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        request.log.debug(
          { err: error, url: request.url, method: request.method },
          "Client error",
        );
      } else {
        request.log.error(
          { err: error, url: request.url, method: request.method },
          "Server error",
        );
      }

      reply.status(error.statusCode || 500).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode || 500,
      });
    },
  );
});
