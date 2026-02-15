import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const RoleBaseSchema = z
  .object({
    id: z.string().cuid(),
    name: z.string().min(2),
    description: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("Role");

export const RoleCreateSchema = RoleBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("RoleCreate");

export const RoleUpdateSchema = RoleBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi("RoleUpdate");

export const RoleResponseSchema = RoleBaseSchema.openapi("RoleResponse");

export const RoleListResponseSchema = z
  .array(RoleResponseSchema)
  .openapi("RoleListResponse");

export const AssignRoleSchema = z
  .object({
    roleId: z.string().cuid(),
  })
  .openapi("AssignRole");

export type Role = z.infer<typeof RoleBaseSchema>;
export type RoleCreate = z.infer<typeof RoleCreateSchema>;
export type RoleUpdate = z.infer<typeof RoleUpdateSchema>;
export type RoleResponse = z.infer<typeof RoleResponseSchema>;
export type RoleListResponse = z.infer<typeof RoleListResponseSchema>;
export type AssignRole = z.infer<typeof AssignRoleSchema>;
