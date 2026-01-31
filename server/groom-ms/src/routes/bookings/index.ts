import { ROUTES } from "@constants";
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
import { createRouteSchema } from "@utils/schema";
import type { FastifyPluginAsync } from "fastify";

const bookingRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new BookingService(fastify);
  const controller = new BookingController(service);

  // Apply authGuard to all routes in this plugin
  fastify.addHook("preHandler", authGuard);

  fastify.post(
    ROUTES.BOOKINGS,
    {
      schema: createRouteSchema({
        body: CreateBookingRequestSchema,
        response: { 201: BookingResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      }),
    },
    controller.create,
  );

  fastify.get(
    ROUTES.BOOKINGS,
    {
      schema: createRouteSchema({
        querystring: BookingQuerySchema,
        response: { 200: BookingListResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      }),
    },
    controller.list,
  );

  fastify.get(
    ROUTES.BOOKING_BY_ID,
    {
      schema: createRouteSchema({
        params: IdParamSchema,
        response: { 200: BookingResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      }),
    },
    controller.getById,
  );

  fastify.patch(
    ROUTES.BOOKING_BY_ID,
    {
      schema: createRouteSchema({
        params: IdParamSchema,
        body: UpdateBookingRequestSchema,
        response: { 200: BookingResponseSchema },
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      }),
    },
    controller.update,
  );

  fastify.delete(
    ROUTES.BOOKING_BY_ID,
    {
      schema: createRouteSchema({
        params: IdParamSchema,
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
      }),
    },
    controller.delete,
  );
};

export default bookingRoutes;
