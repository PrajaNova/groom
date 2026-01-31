import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    avatar: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roles: z.array(z.string()).optional(),
  })
  .openapi("User");

export const UserCreateSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(8),
    avatar: z.string().optional(),
  })
  .openapi("UserCreate");

export const UserUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    avatar: z.string().optional(),
  })
  .openapi("UserUpdate");

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export const UserResponseSchema = UserSchema;
export type UserResponse = z.infer<typeof UserResponseSchema>;
