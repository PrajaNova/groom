import { ERROR_MESSAGES } from "@constants";
import type { BookingStatus } from "@generated/client";
import type {
  BookingQuery,
  CreateBookingRequest,
  UpdateBookingRequest,
} from "@schemas/booking.schema";
import { BookingService } from "@services/booking.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class BookingController {
  constructor(private fastify: FastifyInstance) {}

  async create(
    request: FastifyRequest<{ Body: CreateBookingRequest }>,
    reply: FastifyReply,
  ) {
    try {
      const bookingService = new BookingService(this.fastify);
      const booking = await bookingService.createBooking({
        ...request.body,
        reason: request.body.reason || "No reason provided",
        userId: request.user?.id,
      });
      return reply.code(201).send(booking);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async initiate(
    request: FastifyRequest<{ Body: CreateBookingRequest }>,
    reply: FastifyReply,
  ) {
    try {
      const bookingService = new BookingService(this.fastify);
      const result = await bookingService.initiateBooking({
        ...request.body,
        reason: request.body.reason || "No reason provided",
        userId: request.user?.id,
      });
      return reply.send(result);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async verify(
    request: FastifyRequest<{
      Body: {
        bookingId: string;
        paypalOrderId: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const bookingService = new BookingService(this.fastify);
      const booking = await bookingService.verifyPayment(request.body);
      return reply.send(booking);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async list(
    request: FastifyRequest<{ Querystring: BookingQuery }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      const bookingService = new BookingService(this.fastify);
      const isAdmin =
        request.user.roles?.includes("ADMIN") ||
        request.user.roles?.includes("SUPER_ADMIN");

      // Build filters
      const filters: any = {
        status: request.query.status
          ? (request.query.status.split(",") as BookingStatus[])
          : undefined,
        fromDate: request.query.fromDate
          ? new Date(request.query.fromDate)
          : undefined,
        sort: request.query.sort,
      };

      if (isAdmin) {
        if (request.query.userId) filters.userId = request.query.userId;
      } else {
        filters.userId = request.user.id;
      }

      const bookings = await bookingService.getBookings(filters);
      return reply.send(bookings);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      const bookingService = new BookingService(this.fastify);
      const booking = await bookingService.getBookingById(request.params.id);

      if (!booking) {
        return reply.notFound("Booking not found");
      }

      const isAdmin =
        request.user.roles?.includes("ADMIN") ||
        request.user.roles?.includes("SUPER_ADMIN");
      const isOwner =
        booking.userId === request.user.id ||
        booking.email === request.user.email;

      if (!isAdmin && !isOwner) {
        return reply.forbidden(ERROR_MESSAGES.FORBIDDEN);
      }

      return reply.send(booking);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateBookingRequest;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      const bookingService = new BookingService(this.fastify);
      const booking = await bookingService.getBookingById(request.params.id);

      if (!booking) {
        return reply.notFound("Booking not found");
      }

      const isAdmin =
        request.user.roles?.includes("ADMIN") ||
        request.user.roles?.includes("SUPER_ADMIN");
      const isOwner =
        booking.userId === request.user.id ||
        booking.email === request.user.email;

      if (!isAdmin && !isOwner) {
        return reply.forbidden(ERROR_MESSAGES.FORBIDDEN);
      }

      // Business Rule: Non-admins can only update/cancel PENDING bookings
      if (!isAdmin && booking.status !== "pending") {
        return reply.forbidden(
          "You can only reschedule or cancel pending bookings. Please contact support for assistance.",
        );
      }

      const updateData = {
        ...request.body,
        status: isAdmin
          ? (request.body.status as BookingStatus | undefined)
          : undefined, // Non-admins cannot change status
        when: request.body.when ? new Date(request.body.when) : undefined,
      };

      const updated = await bookingService.updateBooking(
        request.params.id,
        updateData,
      );
      return reply.send(updated);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      const bookingService = new BookingService(this.fastify);
      const booking = await bookingService.getBookingById(request.params.id);

      if (!booking) {
        return reply.notFound("Booking not found");
      }

      const isAdmin =
        request.user.roles?.includes("ADMIN") ||
        request.user.roles?.includes("SUPER_ADMIN");
      const isOwner =
        booking.userId === request.user.id ||
        booking.email === request.user.email;

      if (!isAdmin && !isOwner) {
        return reply.forbidden(ERROR_MESSAGES.FORBIDDEN);
      }

      // Business Rule: Non-admins can only cancel PENDING bookings
      if (!isAdmin && booking.status !== "pending") {
        return reply.forbidden(
          "You can only cancel pending bookings. Please contact support for assistance.",
        );
      }

      const result = await bookingService.cancelBooking(request.params.id);
      return reply.send(result);
    } catch (error) {
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
