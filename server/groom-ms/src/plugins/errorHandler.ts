import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/**
 * Custom error handler to prevent @fastify/sensible HTTP errors
 * from being logged as server errors (they're expected client errors)
 */
export default fp(async (fastify) => {
  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      // Don't log expected HTTP errors from @fastify/sensible (4xx errors)
      if (
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        // Just log at debug level for client errors
        request.log.debug(
          { err: error, url: request.url, method: request.method },
          "Client error",
        );
      } else {
        // Log server errors (5xx) normally
        request.log.error(
          { err: error, url: request.url, method: request.method },
          "Server error",
        );
      }

      // Send the error response
      reply.status(error.statusCode || 500).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode || 500,
      });
    },
  );
});
