import type { FastifyInstance } from "fastify";
import { BookingController } from "../controllers/booking.controller";
import {
  BookingListResponseSchema,
  BookingQuerySchema,
  BookingResponseSchema,
  CreateBookingRequestSchema,
  UpdateBookingRequestSchema,
} from "../schemas/booking.schema";
import { IdParamSchema } from "../schemas/common";
import { BookingService } from "../services/booking.service";
import { createRouteSchema } from "../utils/schema";

export default async function bookingRoutes(fastify: FastifyInstance) {
  const bookingService = new BookingService(fastify.prisma);
  const bookingController = new BookingController(bookingService);

  fastify.post(
    "/bookings",
    {
      schema: createRouteSchema({
        body: CreateBookingRequestSchema,
        response: {
          201: BookingResponseSchema,
        },
      }),
    },
    bookingController.create,
  );

  fastify.get(
    "/bookings",
    {
      schema: createRouteSchema({
        querystring: BookingQuerySchema,
        response: {
          200: BookingListResponseSchema,
        },
      }),
    },
    bookingController.list,
  );

  fastify.get(
    "/bookings/:id",
    {
      schema: createRouteSchema({
        params: IdParamSchema,
        response: {
          200: BookingResponseSchema,
        },
      }),
    },
    bookingController.getById,
  );

  fastify.put(
    "/bookings/:id",
    {
      schema: createRouteSchema({
        params: IdParamSchema,
        body: UpdateBookingRequestSchema,
        response: {
          200: BookingResponseSchema,
        },
      }),
    },
    bookingController.update,
  );

  fastify.delete(
    "/bookings/:id",
    {
      schema: createRouteSchema({
        params: IdParamSchema,
      }),
    },
    bookingController.delete,
  );
}
