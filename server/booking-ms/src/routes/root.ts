import { FastifyInstance } from "fastify";

export default async function root(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { status: "OK", service: "booking-ms" };
  });

  fastify.get("/health", async function (request, reply) {
    return { status: "OK", timestamp: new Date() };
  });
}
