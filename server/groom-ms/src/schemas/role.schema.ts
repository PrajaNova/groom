import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const RoleSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .openapi("Role");

export const RoleCreateSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().optional(),
  })
  .openapi("RoleCreate");

export type RoleCreate = z.infer<typeof RoleCreateSchema>;

export const RoleResponseSchema = RoleSchema;
export const RoleListResponseSchema = z
  .array(RoleSchema)
  .openapi("RoleListResponse");

export const AssignRoleSchema = z
  .object({
    roleId: z.string().cuid(),
  })
  .openapi("AssignRole");

export type RoleResponse = z.infer<typeof RoleResponseSchema>;
export type RoleListResponse = z.infer<typeof RoleListResponseSchema>;
export type AssignRole = z.infer<typeof AssignRoleSchema>;
