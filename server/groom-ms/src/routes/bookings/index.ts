import { BookingController } from "@controllers/booking.controller";
import { authGuard } from "@middleware/auth";
import {
  BookingListResponseSchema,
  BookingQuerySchema,
  BookingResponseSchema,
  CreateBookingRequestSchema,
  UpdateBookingRequestSchema,
} from "@schemas/booking.schema";
import { IdParamSchema } from "@schemas/common";
import { BookingService } from "@services/booking.service";
import type { FastifyPluginAsync } from "fastify";

const bookingRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new BookingService(fastify);
  const controller = new BookingController(service);

  // Apply authGuard to all routes in this plugin
  fastify.addHook("preHandler", authGuard);

  fastify.post(
    "/",
    {
      schema: {
        body: CreateBookingRequestSchema,
        response: { 201: BookingResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      },
    },
    controller.create,
  );

  fastify.get(
    "/",
    {
      schema: {
        querystring: BookingQuerySchema,
        response: { 200: BookingListResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      },
    },
    controller.list,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        params: IdParamSchema,
        response: { 200: BookingResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      },
    },
    controller.getById,
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        params: IdParamSchema,
        body: UpdateBookingRequestSchema,
        response: { 200: BookingResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      },
    },
    controller.update,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: IdParamSchema,
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      },
    },
    controller.delete,
  );
};

export default bookingRoutes;
