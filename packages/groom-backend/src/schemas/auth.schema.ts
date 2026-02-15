import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { UserResponseSchema } from "./user.schema";

extendZodWithOpenApi(z);

// Register Request Schema
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

// Auth Response Schema - no sessionToken in body (HttpOnly cookie is sufficient)
export const AuthResponseSchema = z
  .object({
    success: z.boolean(),
    user: UserResponseSchema,
    message: z.string(),
  })
  .openapi("AuthResponse");

// User Profile Response Schema
export const UserProfileResponseSchema = z
  .object({
    user: UserResponseSchema,
    linkedProviders: z.array(z.string()),
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
  .object({
    providers: z.array(ProviderSchema),
    branding: z.object({
      name: z.string(),
      logoUrl: z.string().optional(),
      primaryColor: z.string(),
      secondaryColor: z.string(),
      loginTitle: z.string(),
      loginSubtitle: z.string(),
      loginFooter: z.string(),
    }).optional()
  })
  .openapi("ProviderListResponse");

// TypeScript type exports
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type ProviderListResponse = z.infer<typeof ProviderListResponseSchema>;
