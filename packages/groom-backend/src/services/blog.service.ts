import type { Blog } from "@generated/client";
import {
  type BlogCreate,
  BlogCreateSchema,
  type BlogUpdate,
  BlogUpdateSchema,
} from "@schemas/blog.schema";
import type { FastifyInstance } from "fastify";

export class BlogService {
  constructor(private fastify: FastifyInstance) {}

  async getAllBlogs(): Promise<Blog[]> {
    return this.fastify.prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    return this.fastify.prisma.blog.findUnique({
      where: { slug },
    });
  }

  async createBlog(data: BlogCreate): Promise<Blog> {
    const validated = BlogCreateSchema.parse(data);

    return this.fastify.prisma.blog.create({
      data: {
        slug: validated.slug,
        title: validated.title,
        content: validated.content,
        excerpt: validated.excerpt,
        author: validated.author,
        publishedAt: validated.publishedAt,
        category: validated.category,
        imageSeed: validated.imageSeed,
        readTime: validated.readTime,
      },
    });
  }

  async updateBlog(slug: string, data: BlogUpdate): Promise<Blog | null> {
    const validated = BlogUpdateSchema.parse(data);

    const blog = await this.getBlogBySlug(slug);
    if (!blog) {
      return null;
    }

    return this.fastify.prisma.blog.update({
      where: { slug },
      data: validated,
    });
  }

  async deleteBlog(slug: string): Promise<boolean> {
    const blog = await this.getBlogBySlug(slug);
    if (!blog) {
      return false;
    }

    await this.fastify.prisma.blog.delete({
      where: { slug },
    });

    return true;
  }
}
