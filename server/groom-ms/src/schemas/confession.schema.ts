import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ConfessionSchema = z
  .object({
    id: z.string().uuid(),
    content: z.string(),
    createdAt: z.string().datetime().or(z.date()),
  })
  .openapi("Confession");

export const CreateConfessionRequestSchema = z
  .object({
    content: z.string().min(1),
  })
  .openapi("CreateConfessionRequest");

export const ConfessionResponseSchema = ConfessionSchema;
export const ConfessionListResponseSchema = z.array(ConfessionSchema);

// Types
export type CreateConfessionRequest = z.infer<
  typeof CreateConfessionRequestSchema
>;
export type ConfessionResponse = z.infer<typeof ConfessionSchema>;
