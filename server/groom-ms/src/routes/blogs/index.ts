import { BlogController } from "@controllers/blog.controller";
import { authGuard } from "@middleware/auth";
import { requireRole } from "@middleware/role";
import {
  BlogListResponseSchema,
  BlogResponseSchema,
  type CreateBlogRequest,
  CreateBlogRequestSchema,
} from "@schemas/blog.schema";
import { BlogService } from "@services/blog.service";
import type { FastifyPluginAsync } from "fastify";

const blogRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new BlogService(fastify);
  const controller = new BlogController(service);

  // Public Routes
  fastify.get(
    "/",
    {
      schema: {
        response: { 200: BlogListResponseSchema },
        tags: ["Blogs"],
      },
    },
    controller.getAll,
  );

  fastify.get(
    "/:slug",
    {
      schema: {
        params: {
          type: "object",
          properties: { slug: { type: "string" } },
          required: ["slug"],
        },
        response: { 200: BlogResponseSchema },
        tags: ["Blogs"],
      },
    },
    controller.getBySlug,
  );

  // Protected Routes
  fastify.post<{ Body: CreateBlogRequest }>(
    "/",
    {
      preHandler: [authGuard, requireRole("ADMIN")],
      schema: {
        body: CreateBlogRequestSchema,
        response: { 201: BlogResponseSchema },
        tags: ["Blogs"],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    controller.create,
  );
};

export default blogRoutes;
