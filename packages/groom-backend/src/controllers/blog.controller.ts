import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants";
import { BlogService } from "@services/blog.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class BlogController {
  constructor(private fastify: FastifyInstance) {}

  async list(_request: FastifyRequest, _reply: FastifyReply) {
    const blogService = new BlogService(this.fastify);
    return await blogService.getAllBlogs();
  }

  async getBySlug(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply,
  ) {
    const blogService = new BlogService(this.fastify);
    const blog = await blogService.getBlogBySlug(request.params.slug);

    if (!blog) {
      return reply.notFound(ERROR_MESSAGES.BLOG_NOT_FOUND);
    }

    return blog;
  }

  async create(
    request: FastifyRequest<{
      Body: {
        slug: string;
        title: string;
        content: string;
        excerpt?: string;
        author?: string;
        category?: string;
        imageSeed?: string;
        readTime?: number;
      };
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const blogService = new BlogService(this.fastify);

    try {
      const blog = await blogService.createBlog(request.body);
      return reply.code(201).send(blog);
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.conflict("Blog with this slug already exists");
      }
      return reply.internalServerError("Failed to create blog");
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { slug: string };
      Body: Partial<{
        title: string;
        content: string;
        excerpt: string;
        author: string;
        category: string;
        imageSeed: string;
        readTime: number;
      }>;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const blogService = new BlogService(this.fastify);
    const blog = await blogService.updateBlog(
      request.params.slug,
      request.body,
    );

    if (!blog) {
      return reply.notFound(ERROR_MESSAGES.BLOG_NOT_FOUND);
    }

    return blog;
  }

  async delete(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const blogService = new BlogService(this.fastify);
    const success = await blogService.deleteBlog(request.params.slug);

    if (!success) {
      return reply.notFound(ERROR_MESSAGES.BLOG_NOT_FOUND);
    }

    return { success: true, message: SUCCESS_MESSAGES.BLOG_DELETED };
  }
}
