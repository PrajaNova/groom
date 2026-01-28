import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Common Error Schema
export const ErrorSchema = z
  .object({
    statusCode: z.number().openapi({ example: 400 }),
    error: z.string().openapi({ example: "Bad Request" }),
    message: z.string().openapi({ example: "Validation failed" }),
  })
  .openapi("Error");

// Success Response Schema
export const SuccessResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
  })
  .openapi("SuccessResponse");

// Pagination Schema
export const PaginationSchema = z
  .object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .openapi("Pagination");

// ID Parameter Schema
export const IdParamSchema = z
  .object({
    id: z.string().cuid(),
  })
  .openapi("IdParam");

// UUID Parameter Schema
export const UuidParamSchema = z
  .object({
    id: z.string().uuid(),
  })
  .openapi("UuidParam");

// TypeScript type exports
export type ErrorResponse = z.infer<typeof ErrorSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
export type UuidParam = z.infer<typeof UuidParamSchema>;
