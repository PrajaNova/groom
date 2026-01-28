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

// ID Parameter Schema
export const IdParamSchema = z
  .object({
    id: z.string().uuid(),
  })
  .openapi("IdParam");
