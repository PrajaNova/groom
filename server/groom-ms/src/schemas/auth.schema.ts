import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { SessionResponseSchema } from "./session.schema";
import { UserResponseSchema } from "./user.schema";

extendZodWithOpenApi(z);

// Register Request Schema - extends UserCreate with password requirements
export const RegisterRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(2).max(100),
    avatar: z.string().url().optional(),
  })
  .openapi("RegisterRequest");

// Login Request Schema
export const LoginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .openapi("LoginRequest");

// Auth Response Schema - uses unified User and Session schemas
export const AuthResponseSchema = z
  .object({
    user: UserResponseSchema,
    sessionToken: z.string(),
  })
  .openapi("AuthResponse");

// User Profile Response Schema - includes session info
export const UserProfileResponseSchema = z
  .object({
    user: UserResponseSchema,
    session: SessionResponseSchema,
  })
  .openapi("UserProfileResponse");

// OAuth Provider Schema
export const ProviderSchema = z
  .object({
    name: z.string(),
    displayName: z.string(),
    icon: z.string(),
    enabled: z.boolean(),
  })
  .openapi("Provider");

// Provider List Response
export const ProviderListResponseSchema = z
  .array(ProviderSchema)
  .openapi("ProviderListResponse");

// TypeScript type exports
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type ProviderListResponse = z.infer<typeof ProviderListResponseSchema>;
