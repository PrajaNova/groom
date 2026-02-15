import { BLOG_ROUTES } from "@constants";
import { BlogController } from "@controllers/blog.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import {
  BlogCreateSchema,
  BlogListResponseSchema,
  BlogResponseSchema,
  BlogUpdateSchema,
} from "@schemas/blog.schema";
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

const SlugParamSchema = z.object({ slug: z.string() });

export default async function blogRoutes(fastify: FastifyInstance) {
  const blogController = new BlogController(fastify);

  // GET /blogs - List all blogs (public)
  fastify.get(
    BLOG_ROUTES.LIST,
    {
      schema: createRouteSchema({
        response: { 200: BlogListResponseSchema },
      }),
    },
    async (request, reply) => blogController.list(request, reply),
  );

  // GET /blogs/:slug - Get blog by slug (public)
  fastify.get<{ Params: { slug: string } }>(
    BLOG_ROUTES.BY_SLUG,
    {
      schema: createRouteSchema({
        params: SlugParamSchema,
        response: { 200: BlogResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => blogController.getBySlug(request, reply),
  );

  // POST /blogs - Create blog (ADMIN only)
  fastify.post(
    BLOG_ROUTES.CREATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        body: BlogCreateSchema,
        response: { 201: BlogResponseSchema, 400: ErrorSchema, 409: ErrorSchema },
      }),
    },
    async (request, reply) => blogController.create(request as any, reply),
  );

  // PUT /blogs/:slug - Update blog (ADMIN only)
  fastify.put<{ Params: { slug: string } }>(
    BLOG_ROUTES.UPDATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        params: SlugParamSchema,
        body: BlogUpdateSchema,
        response: { 200: BlogResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => blogController.update(request as any, reply),
  );

  // DELETE /blogs/:slug - Delete blog (ADMIN only)
  fastify.delete<{ Params: { slug: string } }>(
    BLOG_ROUTES.DELETE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        params: SlugParamSchema,
        response: { 200: SuccessResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => blogController.delete(request, reply),
  );
}
