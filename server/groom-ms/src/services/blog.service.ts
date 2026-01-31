import type { PrismaClient } from "@generated/client";
import type {
  CreateBlogRequest,
  UpdateBlogRequest,
} from "@schemas/blog.schema";
import type { FastifyInstance } from "fastify";

export class BlogService {
  private prisma: PrismaClient;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
  }

  async getAllBlogs() {
    return await this.prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlogBySlug(slug: string) {
    return await this.prisma.blog.findUnique({
      where: { slug },
    });
  }

  async createBlog(data: CreateBlogRequest) {
    return await this.prisma.blog.create({
      data: {
        ...data,
        author: data.author ?? null,
        excerpt: data.excerpt ?? null,
        category: data.category ?? null,
        imageSeed: data.imageSeed ?? null,
        readTime: data.readTime ?? null,
      },
    });
  }

  async updateBlog(slug: string, data: UpdateBlogRequest) {
    return await this.prisma.blog.update({
      where: { slug },
      data,
    });
  }

  async deleteBlog(slug: string) {
    return await this.prisma.blog.delete({
      where: { slug },
    });
  }
}
