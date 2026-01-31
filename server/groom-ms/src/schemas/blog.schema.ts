import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const BlogSchema = z
  .object({
    id: z.string().uuid(),
    slug: z.string(),
    title: z.string(),
    content: z.string(), // Markdown
    excerpt: z.string().nullable().optional(),
    author: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    imageSeed: z.string().nullable().optional(),
    readTime: z.number().int().optional(),
    publishedAt: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
  })
  .openapi("Blog");

export const CreateBlogRequestSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    imageSeed: z.string().optional(),
    readTime: z.number().optional(),
  })
  .openapi("CreateBlogRequest");

export const UpdateBlogRequestSchema =
  CreateBlogRequestSchema.partial().openapi("UpdateBlogRequest");

export const BlogResponseSchema = BlogSchema;
export const BlogListResponseSchema = z.array(BlogSchema);

// Types
export type CreateBlogRequest = z.infer<typeof CreateBlogRequestSchema>;
export type UpdateBlogRequest = z.infer<typeof UpdateBlogRequestSchema>;
export type BlogResponse = z.infer<typeof BlogSchema>;
