import { ROUTES } from "@constants";
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
import { createRouteSchema } from "@utils/schema";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const blogRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new BlogService(fastify);
  const controller = new BlogController(service);

  // Public Routes
  fastify.get(
    ROUTES.BLOGS,
    {
      schema: createRouteSchema({
        response: { 200: BlogListResponseSchema },
        tags: ["Blogs"],
      }),
    },
    controller.getAll,
  );

  fastify.get(
    ROUTES.BLOG_BY_SLUG,
    {
      schema: createRouteSchema({
        params: z.object({ slug: z.string() }),
        response: { 200: BlogResponseSchema },
        tags: ["Blogs"],
      }),
    },
    controller.getBySlug,
  );

  // Protected Routes
  fastify.post<{ Body: CreateBlogRequest }>(
    ROUTES.BLOGS,
    {
      preHandler: [authGuard, requireRole("ADMIN")],
      schema: createRouteSchema({
        body: CreateBlogRequestSchema,
        response: { 201: BlogResponseSchema },
        tags: ["Blogs"],
        security: [{ bearerAuth: [] }],
      }),
    },
    controller.create,
  );
};

export default blogRoutes;
