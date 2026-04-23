import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const FAQBaseSchema = z
  .object({
    id: z.string().cuid(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    order: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("FAQ");

export const FAQCreateSchema = FAQBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("FAQCreate");

export const FAQUpdateSchema = FAQBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi("FAQUpdate");

export const FAQResponseSchema = FAQBaseSchema.openapi("FAQResponse");

export const FAQListResponseSchema = z
  .array(FAQResponseSchema)
  .openapi("FAQListResponse");

export type FAQ = z.infer<typeof FAQBaseSchema>;
export type FAQCreate = z.infer<typeof FAQCreateSchema>;
export type FAQUpdate = z.infer<typeof FAQUpdateSchema>;
export type FAQResponse = z.infer<typeof FAQResponseSchema>;
export type FAQListResponse = z.infer<typeof FAQListResponseSchema>;
