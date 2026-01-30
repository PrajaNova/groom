import type { FastifyPluginAsync } from "fastify";
import z from "zod";

const BlogSchema = z.object({
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  imageSeed: z.string().optional(),
  readTime: z.number().optional(),
});

const blogRoutes: FastifyPluginAsync = async (
  fastify,
  _opts,
): Promise<void> => {
  // GET /blogs
  fastify.get("/", async (_request, _reply) => {
    const blogs = await fastify.prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return blogs;
  });

  // GET /blogs/:slug
  fastify.get<{ Params: { slug: string } }>(
    "/:slug",
    async (request, reply) => {
      const { slug } = request.params;
      const blog = await fastify.prisma.blog.findUnique({
        where: { slug },
      });

      if (!blog) {
        reply.code(404);
        return { error: "Blog not found" };
      }
      return blog;
    },
  );

  // POST /blogs (Admin only ideally, but open for now for migration/seeding)
  fastify.post<{ Body: z.infer<typeof BlogSchema> }>(
    "/",
    async (request, reply) => {
      const data = request.body;
      try {
        const blog = await fastify.prisma.blog.create({
          data,
        });
        return blog;
      } catch (e) {
        request.log.error(e);
        reply.code(500);
        return { error: "Failed to create blog" };
      }
    },
  );
};

export default blogRoutes;
