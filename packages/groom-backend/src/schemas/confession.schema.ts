import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ConfessionBaseSchema = z
  .object({
    id: z.string().cuid(),
    content: z.string().min(1),
    createdAt: z.coerce.date(),
  })
  .openapi("Confession");

export const ConfessionCreateSchema = z
  .object({
    content: z.string().min(1, "Confession content is required"),
  })
  .openapi("ConfessionCreate");

export const ConfessionResponseSchema =
  ConfessionBaseSchema.openapi("ConfessionResponse");

export const ConfessionListResponseSchema = z
  .array(ConfessionResponseSchema)
  .openapi("ConfessionListResponse");

export type Confession = z.infer<typeof ConfessionBaseSchema>;
export type ConfessionCreate = z.infer<typeof ConfessionCreateSchema>;
export type ConfessionResponse = z.infer<typeof ConfessionResponseSchema>;
export type ConfessionListResponse = z.infer<
  typeof ConfessionListResponseSchema
>;
