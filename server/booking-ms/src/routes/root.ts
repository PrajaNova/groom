import type { FastifyInstance } from "fastify";

export default async function root(fastify: FastifyInstance) {
  fastify.get("/", async (_request, _reply) => ({
    status: "OK",
    service: "booking-ms",
  }));

  fastify.get("/health", async (_request, _reply) => ({
    status: "OK",
    timestamp: new Date(),
  }));
}
