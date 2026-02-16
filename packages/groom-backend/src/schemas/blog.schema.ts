import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const BlogBaseSchema = z
  .object({
    id: z.string().cuid(),
    slug: z.string().min(1),
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    category: z.string().optional(),
    imageSeed: z.string().optional(),
    readTime: z.number().int().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("Blog");

export const BlogCreateSchema = BlogBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("BlogCreate");

export const BlogUpdateSchema = BlogBaseSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi("BlogUpdate");

export const BlogResponseSchema = BlogBaseSchema.openapi("BlogResponse");

export const BlogListResponseSchema = z
  .array(BlogResponseSchema)
  .openapi("BlogListResponse");

export type Blog = z.infer<typeof BlogBaseSchema>;
export type BlogCreate = z.infer<typeof BlogCreateSchema>;
export type BlogUpdate = z.infer<typeof BlogUpdateSchema>;
export type BlogResponse = z.infer<typeof BlogResponseSchema>;
export type BlogListResponse = z.infer<typeof BlogListResponseSchema>;
