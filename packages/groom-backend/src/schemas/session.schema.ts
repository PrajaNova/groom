import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const SessionBaseSchema = z
  .object({
    id: z.string().cuid(),
    sessionId: z.string(),
    userId: z.string().cuid(),
    expiresAt: z.coerce.date(),
    device: z.string().optional(),
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    createdAt: z.coerce.date(),
  })
  .openapi("Session");

export const SessionCreateSchema = SessionBaseSchema.omit({
  id: true,
  createdAt: true,
}).openapi("SessionCreate");

export const SessionResponseSchema = SessionBaseSchema.omit({
  id: true,
})
  .extend({
    isCurrent: z.boolean().default(false),
  })
  .openapi("SessionResponse");

export const SessionListResponseSchema = z
  .array(SessionResponseSchema)
  .openapi("SessionListResponse");

export type Session = z.infer<typeof SessionBaseSchema>;
export type SessionCreate = z.infer<typeof SessionCreateSchema>;
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
export type SessionListResponse = z.infer<typeof SessionListResponseSchema>;
