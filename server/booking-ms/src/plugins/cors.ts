import fp from 'fastify-plugin';
import cors, { FastifyCorsOptions } from '@fastify/cors';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: true, // Allow all for now, restrict in production
    credentials: true,
  });
});
