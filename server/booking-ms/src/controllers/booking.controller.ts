import type { BookingStatus } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";
import type {
  BookingQuery,
  CreateBookingRequest,
  UpdateBookingRequest,
} from "../schemas/booking.schema";
import type { IdParamSchema } from "../schemas/common"; // Import from common
import type { BookingService } from "../services/booking.service";

type IdParam = z.infer<typeof IdParamSchema>;

export class BookingController {
  constructor(private service: BookingService) {}

  create = async (
    req: FastifyRequest<{ Body: CreateBookingRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      const booking = await this.service.createBooking({
        ...req.body,
        reason: req.body.reason || "No reason provided", // Default if optional
      });
      return reply.code(201).send(booking);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  list = async (
    req: FastifyRequest<{ Querystring: BookingQuery }>,
    reply: FastifyReply,
  ) => {
    try {
      if (req.query.email) {
        const bookings = await this.service.getBookingsByEmail(req.query.email);
        return reply.send(bookings);
      }

      const filters = {
        status: req.query.status
          ? (req.query.status.split(",") as BookingStatus[])
          : undefined,
        fromDate: req.query.fromDate ? new Date(req.query.fromDate) : undefined,
        sort: req.query.sort,
        userId: req.query.userId,
      };

      const bookings = await this.service.getBookings(filters);
      return reply.send(bookings);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  getById = async (
    req: FastifyRequest<{ Params: IdParam }>,
    reply: FastifyReply,
  ) => {
    try {
      const booking = await this.service.getBookingById(req.params.id);
      if (!booking) {
        return reply.notFound("Booking not found");
      }
      return reply.send(booking);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  update = async (
    req: FastifyRequest<{ Params: IdParam; Body: UpdateBookingRequest }>,
    reply: FastifyReply,
  ) => {
    try {
      const updateData = {
        ...req.body,
        status: req.body.status as BookingStatus | undefined,
        when: req.body.when ? new Date(req.body.when) : undefined,
      };

      const booking = await this.service.updateBooking(
        req.params.id,
        updateData,
      );
      return reply.send(booking);
    } catch (error) {
      if (error instanceof Error && error.message === "Booking not found") {
        return reply.notFound(error.message);
      }
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  delete = async (
    req: FastifyRequest<{ Params: IdParam }>,
    reply: FastifyReply,
  ) => {
    try {
      const result = await this.service.cancelBooking(req.params.id);
      return reply.send(result);
    } catch (error) {
      if (error instanceof Error && error.message === "Booking not found") {
        return reply.notFound(error.message);
      }
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  };
}
