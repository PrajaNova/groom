import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Base User Schema - matches API User type (flattened)
export const UserBaseSchema = z
  .object({
    id: z.string().cuid(),
    email: z.string().email(),
    roles: z.array(z.string()).default([]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),

    // Profile Fields
    name: z.string().min(2),
    avatar: z.string().url().optional().nullable(),
    bio: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    dateOfBirth: z.coerce.date().optional().nullable(),
    gender: z.string().optional().nullable(),

    // Address Fields
    street: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
  })
  .openapi("User");

// User Create Schema
export const UserCreateSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    avatar: z.string().url().optional(),
  })
  .openapi("UserCreate");

// User Update Schema
export const UserUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    avatar: z.string().url().optional(),
    bio: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  })
  .partial()
  .openapi("UserUpdate");

// User Response Schema - public-facing (omits sensitive data)
export const UserResponseSchema = UserBaseSchema.openapi("UserResponse");

// User List Response Schema
export const UserListResponseSchema = z
  .array(UserResponseSchema)
  .openapi("UserListResponse");

// TypeScript type exports
export type User = z.infer<typeof UserBaseSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
