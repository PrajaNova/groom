import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Base User Schema - matches Prisma model
export const UserBaseSchema = z
  .object({
    id: z.string().cuid(),
    email: z.string().email(),
    name: z.string().min(2),
    avatar: z.url().optional(),
    password: z.string().optional(), // Hashed password for local auth
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("User");

// User Create Schema - for registration (omits auto-generated fields)
export const UserCreateSchema = UserBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    password: z.string().min(8), // Required for registration
  })
  .openapi("UserCreate");

// User Update Schema - for profile updates (all fields optional except id)
export const UserUpdateSchema = UserBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  password: true, // Password updates handled separately
})
  .partial()
  .openapi("UserUpdate");

// User Response Schema - public-facing (omits sensitive data)
export const UserResponseSchema = UserBaseSchema.omit({
  password: true,
})
  .extend({
    roles: z.array(z.string()).default([]),
  })
  .openapi("UserResponse");

// User with Roles Schema - includes role details
export const UserWithRolesSchema = UserResponseSchema.extend({
  roles: z.array(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
      description: z.string().optional(),
    }),
  ),
}).openapi("UserWithRoles");

// TypeScript type exports
export type User = z.infer<typeof UserBaseSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserWithRoles = z.infer<typeof UserWithRolesSchema>;
