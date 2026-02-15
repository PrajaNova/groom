import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const TestimonialBaseSchema = z
  .object({
    id: z.string().cuid(),
    quote: z.string().min(1),
    author: z.string().min(1),
    createdAt: z.coerce.date(),
  })
  .openapi("Testimonial");

export const TestimonialCreateSchema = z
  .object({
    quote: z.string().min(1, "Quote is required"),
    author: z.string().min(1, "Author is required"),
  })
  .openapi("TestimonialCreate");

export const TestimonialUpdateSchema = z
  .object({
    quote: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
  })
  .partial()
  .openapi("TestimonialUpdate");

export const TestimonialResponseSchema = TestimonialBaseSchema.openapi("TestimonialResponse");

export const TestimonialListResponseSchema = z
  .array(TestimonialResponseSchema)
  .openapi("TestimonialListResponse");

export type Testimonial = z.infer<typeof TestimonialBaseSchema>;
export type TestimonialCreate = z.infer<typeof TestimonialCreateSchema>;
export type TestimonialUpdate = z.infer<typeof TestimonialUpdateSchema>;
export type TestimonialResponse = z.infer<typeof TestimonialResponseSchema>;
export type TestimonialListResponse = z.infer<typeof TestimonialListResponseSchema>;
