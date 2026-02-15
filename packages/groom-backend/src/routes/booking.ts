import { BOOKING_ROUTES } from "@constants";
import { BookingController } from "@controllers/booking.controller";
import { authGuard, optionalAuth } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import {
  BookingListResponseSchema,
  BookingQuerySchema,
  BookingResponseSchema,
  CreateBookingRequestSchema,
  UpdateBookingRequestSchema,
} from "@schemas/booking.schema";
import { ErrorSchema, IdParamSchema } from "@schemas/common";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function bookingRoutes(fastify: FastifyInstance) {
  const bookingController = new BookingController(fastify);

  // POST /bookings - Create booking (public, but optional auth links user)
  fastify.post(
    BOOKING_ROUTES.CREATE,
    {
      preHandler: [optionalAuth],
      schema: createRouteSchema({
        body: CreateBookingRequestSchema,
        response: { 201: BookingResponseSchema, 400: ErrorSchema },
      }),
    },
    async (request, reply) => bookingController.create(request as any, reply),
  );

  // POST /bookings/initiate - Initiate booking & payment
  fastify.post(
    "/bookings/initiate",
    {
      preHandler: [optionalAuth],
      schema: createRouteSchema({
        body: CreateBookingRequestSchema,
        // response: ... (let's keep flexible for now or define schema later)
      }),
    },
    async (request, reply) => bookingController.initiate(request as any, reply),
  );

  // POST /bookings/verify - Verify payment & confirm
  fastify.post(
    "/bookings/verify",
    {
      // Public route, security via signature verification
    },
    async (request, reply) => bookingController.verify(request as any, reply),
  );

  // GET /bookings - List bookings (Protected: Admin=All, User=Own)
  fastify.get(
    BOOKING_ROUTES.LIST,
    {
      preHandler: [authGuard],
      schema: createRouteSchema({
        querystring: BookingQuerySchema,
        response: { 200: BookingListResponseSchema },
      }),
    },
    async (request, reply) => bookingController.list(request as any, reply),
  );

  // GET /bookings/:id - Get booking by ID (Protected: Admin or Owner)
  fastify.get(
    BOOKING_ROUTES.BY_ID,
    {
      preHandler: [authGuard],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: { 200: BookingResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => bookingController.getById(request as any, reply),
  );

  // PUT /bookings/:id - Update booking (ADMIN only)
  fastify.put(
    BOOKING_ROUTES.UPDATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: UpdateBookingRequestSchema,
        response: { 200: BookingResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => bookingController.update(request as any, reply),
  );

  // DELETE /bookings/:id - Cancel booking (ADMIN only)
  fastify.delete(
    BOOKING_ROUTES.DELETE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
      }),
    },
    async (request, reply) => bookingController.delete(request as any, reply),
  );
}
