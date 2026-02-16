import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const BookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const BookingSchema = z
  .object({
    id: z.string().cuid(),
    name: z.string().min(2),
    email: z.string().email(),
    when: z
      .string()
      .datetime()
      .or(z.date().transform((d) => d.toISOString())),
    reason: z.string(),
    userId: z.string().nullable().optional(),
    status: BookingStatusSchema,
    meetingId: z.string().nullable().optional(),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
  })
  .openapi("Booking");

export const CreateBookingRequestSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    when: z.string().datetime(),
    reason: z.string().optional(),
    userId: z.string().optional(),
    status: BookingStatusSchema.optional(),
    meetingId: z.string().optional(),
  })
  .openapi("CreateBookingRequest");

export const UpdateBookingRequestSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    when: z.string().datetime().optional(),
    reason: z.string().optional(),
    status: BookingStatusSchema.optional(),
  })
  .openapi("UpdateBookingRequest");

export const BookingQuerySchema = z
  .object({
    email: z.string().email().optional(),
    userId: z.string().optional(),
    status: z.string().optional(),
    fromDate: z.string().datetime().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
  })
  .openapi("BookingQuery");

export const BookingResponseSchema = BookingSchema;
export const BookingListResponseSchema = z
  .array(BookingSchema)
  .openapi("BookingListResponse");

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type UpdateBookingRequest = z.infer<typeof UpdateBookingRequestSchema>;
export type BookingQuery = z.infer<typeof BookingQuerySchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;
