import type { FastifyPluginAsync } from "fastify";
import z from "zod";

const ConfessionSchema = z.object({
  content: z.string().min(1),
});

const confessionRoutes: FastifyPluginAsync = async (
  fastify,
  _opts,
): Promise<void> => {
  // GET /confessions
  fastify.get("/", async (_request, _reply) => {
    const confessions = await fastify.prisma.confession.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to recent 50
    });
    return confessions;
  });

  // POST /confessions
  fastify.post<{ Body: z.infer<typeof ConfessionSchema> }>(
    "/",
    async (request, reply) => {
      const { content } = request.body;

      try {
        const confession = await fastify.prisma.confession.create({
          data: { content },
        });
        return confession;
      } catch (e) {
        request.log.error(e);
        reply.code(500);
        return { error: "Failed to submit confession" };
      }
    },
  );
};

export default confessionRoutes;
