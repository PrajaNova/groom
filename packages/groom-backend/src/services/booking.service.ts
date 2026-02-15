import type { Booking, BookingStatus } from "@generated/client";
import { EmailService } from "@services/email.service";
import type { FastifyInstance } from "fastify";

export class BookingService {
  private emailService: EmailService;

  constructor(private fastify: FastifyInstance) {
    this.emailService = new EmailService(this.fastify);
  }

  async createBooking(data: {
    name: string;
    email: string;
    when: string | Date;
    reason: string;
    userId?: string;
    status?: BookingStatus;
    meetingId?: string;
  }): Promise<Booking> {
    if (!data.email || !data.when || !data.name) {
      throw new Error("Email, Name, and When are required fields");
    }

    // Check for duplicate pending/confirmed booking
    const existing = await this.fastify.prisma.booking.findFirst({
      where: {
        email: data.email,
        status: { in: ["pending", "confirmed"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return existing;
    }

    return await this.fastify.prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        when: new Date(data.when),
        reason: data.reason ?? "No reason provided",
        userId: data.userId,
        status: data.status ?? "pending",
        meetingId: data.meetingId,
      },
    });
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return await this.fastify.prisma.booking.findUnique({
      where: { id },
    });
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return await this.fastify.prisma.booking.findMany({
      where: { email },
      orderBy: { when: "desc" },
    });
  }

  async getBookings(filters?: {
    status?: BookingStatus[];
    fromDate?: Date;
    sort?: "asc" | "desc";
    userId?: string;
  }): Promise<Booking[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = { in: filters.status };
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.fromDate) {
      where.when = { gte: filters.fromDate };
    }

    return await this.fastify.prisma.booking.findMany({
      where,
      orderBy: { when: filters?.sort ?? "asc" },
    });
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const existingBooking = await this.getBookingById(id);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    // Handle Confirmation Logic
    if (data.status === "confirmed" && existingBooking.status !== "confirmed") {
      const meetingId =
        existingBooking.meetingId || this.emailService.generateMeetingId(existingBooking.email);

      const updated = await this.fastify.prisma.booking.update({
        where: { id },
        data: {
          status: "confirmed",
          meetingId,
          ...data,
        },
      });

      // Send email
      await this.emailService
        .sendBookingConfirmationEmail({
          to: existingBooking.email,
          name: existingBooking.name,
          scheduledTime: new Date(existingBooking.when),
          meetingId,
        })
        .catch((err) =>
          this.fastify.log.error(err, "Failed to send confirmation email"),
        );

      return updated;
    }

    // Handle Rescheduling Logic
    if (
      data.when &&
      new Date(data.when).getTime() !== new Date(existingBooking.when).getTime()
    ) {
      const newTime = new Date(data.when);

      const updated = await this.fastify.prisma.booking.update({
        where: { id },
        data: {
          when: newTime,
          ...data,
        },
      });

      await this.emailService
        .sendBookingUpdateEmail({
          to: existingBooking.email,
          name: existingBooking.name,
          newTime,
          meetingId: existingBooking.meetingId || undefined,
        })
        .catch((err) =>
          this.fastify.log.error(err, "Failed to send reschedule email"),
        );

      return updated;
    }

    // Standard update
    return await this.fastify.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async cancelBooking(id: string): Promise<{ message: string }> {
    const booking = await this.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await this.fastify.prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await this.emailService
      .sendBookingCancellationEmail({
        to: booking.email,
        name: booking.name,
        originalTime: booking.when,
      })
      .catch((err) =>
        this.fastify.log.error(err, "Failed to send cancellation email"),
      );

    return { message: "Booking cancelled successfully" };
  }
}
