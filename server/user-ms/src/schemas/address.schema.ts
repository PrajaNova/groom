import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Base Address Schema - matches Prisma model
export const AddressBaseSchema = z
  .object({
    id: z.string().cuid(),
    userId: z.string().cuid(),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
    type: z.string().default("Home"),
    isDefault: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("Address");

// Address Create Schema - for creating addresses (omits auto-generated fields)
export const AddressCreateSchema = AddressBaseSchema.omit({
  id: true,
  userId: true, // Will be set from authenticated user
  createdAt: true,
  updatedAt: true,
}).openapi("AddressCreate");

// Address Update Schema - for updates (all fields optional)
export const AddressUpdateSchema = AddressBaseSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi("AddressUpdate");

// Address Response Schema - public-facing
export const AddressResponseSchema =
  AddressBaseSchema.openapi("AddressResponse");

// Address List Response
export const AddressListResponseSchema = z
  .array(AddressResponseSchema)
  .openapi("AddressListResponse");

// TypeScript type exports
export type Address = z.infer<typeof AddressBaseSchema>;
export type AddressCreate = z.infer<typeof AddressCreateSchema>;
export type AddressUpdate = z.infer<typeof AddressUpdateSchema>;
export type AddressResponse = z.infer<typeof AddressResponseSchema>;
export type AddressListResponse = z.infer<typeof AddressListResponseSchema>;
