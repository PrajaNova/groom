import type { CreateBlogRequest } from "@schemas/blog.schema";
import type { BlogService } from "@services/blog.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export class BlogController {
  constructor(private service: BlogService) {}

  getAll = async (_req: FastifyRequest, reply: FastifyReply) => {
    const blogs = await this.service.getAllBlogs();
    return reply.send(blogs);
  };

  getBySlug = async (
    req: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply,
  ) => {
    const blog = await this.service.getBlogBySlug(req.params.slug);
    if (!blog) {
      return reply.notFound("Blog not found");
    }
    return reply.send(blog);
  };

  create = async (
    req: FastifyRequest<{ Body: CreateBlogRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      const blog = await this.service.createBlog(req.body);
      return reply.code(201).send(blog);
    } catch (error) {
      return reply.internalServerError("Failed to create blog");
    }
  };
}
