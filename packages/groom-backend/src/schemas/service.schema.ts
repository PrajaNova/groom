import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ServiceBaseSchema = z
  .object({
    id: z.string().cuid(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    iconType: z.string().min(1, "Icon type is required"),
    colorType: z.string().min(1, "Color type is required"),
    order: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("Service");

export const ServiceCreateSchema = ServiceBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("ServiceCreate");

export const ServiceUpdateSchema = ServiceBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .openapi("ServiceUpdate");

export const ServiceResponseSchema = ServiceBaseSchema.openapi("ServiceResponse");

export const ServiceListResponseSchema = z
  .array(ServiceResponseSchema)
  .openapi("ServiceListResponse");

export type Service = z.infer<typeof ServiceBaseSchema>;
export type ServiceCreate = z.infer<typeof ServiceCreateSchema>;
export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>;
export type ServiceResponse = z.infer<typeof ServiceResponseSchema>;
export type ServiceListResponse = z.infer<typeof ServiceListResponseSchema>;
