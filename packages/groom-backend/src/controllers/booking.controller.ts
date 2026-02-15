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
        userId: request.user?.id, // Optional: associate if logged in (even on public route if auth header sent?)
        // Currently route is public, authGuard not forced. If token present, request.user might be populated if authGuard was optional?
        // But authGuard is not on this route. So request.user is undefined unless we use optionalAuth (not implemented yet).
        // For now, userId is from body if provided, or null.
        // Wait, schema doesn't have userId in body usually.
      });
      return reply.code(201).send(booking);
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
      const isAdmin = request.user.roles?.includes("ADMIN");

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
        // Admin can filter by specific user or email if requested
        if (request.query.userId) filters.userId = request.query.userId;
        // If email query param is supported by service:
        // Service currently has getBookings(filters) and getBookingsByEmail(email)
        // Let's stick to getBookings with userId filter for now, or email if service supports it in filters
      } else {
        // Non-admin sees ONLY their own bookings
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

      const isAdmin = request.user.roles?.includes("ADMIN");
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
    try {
      const bookingService = new BookingService(this.fastify);
      const updateData = {
        ...request.body,
        status: request.body.status as BookingStatus | undefined,
        when: request.body.when ? new Date(request.body.when) : undefined,
      };

      const booking = await bookingService.updateBooking(
        request.params.id,
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
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const bookingService = new BookingService(this.fastify);
      const result = await bookingService.cancelBooking(request.params.id);
      return reply.send(result);
    } catch (error) {
      if (error instanceof Error && error.message === "Booking not found") {
        return reply.notFound(error.message);
      }
      return reply.badRequest(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
