import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Base Session Schema - matches Prisma model
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

// Session Create Schema - for creating sessions
export const SessionCreateSchema = SessionBaseSchema.omit({
  id: true,
  createdAt: true,
}).openapi("SessionCreate");

// Session Response Schema - public-facing with isCurrent flag
export const SessionResponseSchema = SessionBaseSchema.omit({
  id: true,
})
  .extend({
    isCurrent: z.boolean().default(false),
  })
  .openapi("SessionResponse");

// Session List Response
export const SessionListResponseSchema = z
  .array(SessionResponseSchema)
  .openapi("SessionListResponse");

// TypeScript type exports
export type Session = z.infer<typeof SessionBaseSchema>;
export type SessionCreate = z.infer<typeof SessionCreateSchema>;
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
export type SessionListResponse = z.infer<typeof SessionListResponseSchema>;
