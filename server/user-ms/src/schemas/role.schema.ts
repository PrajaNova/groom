import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Base Role Schema - matches Prisma model
export const RoleBaseSchema = z
  .object({
    id: z.string().cuid(),
    name: z.string().min(2),
    description: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("Role");

// Role Create Schema - for creating roles (omits auto-generated fields)
export const RoleCreateSchema = RoleBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("RoleCreate");

// Role Update Schema - for updates (all fields optional)
export const RoleUpdateSchema = RoleBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi("RoleUpdate");

// Role Response Schema - public-facing
export const RoleResponseSchema = RoleBaseSchema.openapi("RoleResponse");

// Role List Response
export const RoleListResponseSchema = z
  .array(RoleResponseSchema)
  .openapi("RoleListResponse");

// Assign Role Schema - for role assignment operations
export const AssignRoleSchema = z
  .object({
    roleId: z.string().cuid(),
  })
  .openapi("AssignRole");

// TypeScript type exports
export type Role = z.infer<typeof RoleBaseSchema>;
export type RoleCreate = z.infer<typeof RoleCreateSchema>;
export type RoleUpdate = z.infer<typeof RoleUpdateSchema>;
export type RoleResponse = z.infer<typeof RoleResponseSchema>;
export type RoleListResponse = z.infer<typeof RoleListResponseSchema>;
export type AssignRole = z.infer<typeof AssignRoleSchema>;
