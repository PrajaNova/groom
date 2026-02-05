import type { Booking, BookingStatus, PrismaClient } from "@generated/client";
import {
  generateMeetingId,
  sendBookingCancellationEmail,
  sendBookingConfirmationEmail,
  sendBookingUpdateEmail,
} from "@utils/email";
import type { FastifyInstance } from "fastify";

export class BookingService {
  private prisma: PrismaClient;

  constructor(fastify: FastifyInstance) {
    this.prisma = fastify.prisma;
  }

  async createBooking(
    data: {
      name: string;
      email: string;
      when: string | Date;
      reason: string;
    },
    userId?: string,
  ) {
    if (!data.email || !data.when || !data.name) {
      throw new Error("Email, Name, and When are required fields");
    }

    // Check for duplicate pending/confirmed booking
    const existing = await this.prisma.booking.findFirst({
      where: {
        email: data.email,
        status: { in: ["pending", "confirmed"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return existing;
    }

    return await this.prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        when: new Date(data.when),
        reason: data.reason ?? "No reason provided",
        userId: userId ?? null,
        status: "pending",
        meetingId: null,
      },
    });
  }

  async getBookingById(id: string) {
    return await this.prisma.booking.findUnique({
      where: { id },
    });
  }

  async getBookingsByEmail(email: string) {
    return await this.prisma.booking.findMany({
      where: { email },
      orderBy: { when: "desc" },
    });
  }

  async getBookings(filters?: {
    status?: BookingStatus[];
    fromDate?: Date;
    toDate?: Date;
    endDay?: Date;
    sort?: "asc" | "desc";
    userId?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = { in: filters.status };
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    // Date Filtering Logic
    if (filters?.fromDate || filters?.toDate || filters?.endDay) {
      where.when = {};
      if (filters.fromDate) {
        where.when.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.when.lte = filters.toDate;
      } else if (filters.endDay) {
        // If endDay is provided, we want to include everything up to the end of that day
        // Assuming endDay is passed as start of the day, we need to add 1 day or set to 23:59:59
        // But simpler might be to trust the frontend/controller to pass the correct ISO string
        // Let's assume endDay matches the 'lte' behavior we want (e.g. 23:59:59)
        where.when.lte = filters.endDay;
      }
    }

    return await this.prisma.booking.findMany({
      where,
      orderBy: { when: filters?.sort ?? "asc" },
    });
  }

  async updateBooking(id: string, data: Partial<Booking>) {
    const existingBooking = await this.getBookingById(id);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    // Handle Confirmation Logic
    if (data.status === "confirmed" && existingBooking.status !== "confirmed") {
      const meetingId =
        existingBooking.meetingId || generateMeetingId(existingBooking.email);

      const updated = await this.prisma.booking.update({
        where: { id },
        data: {
          status: "confirmed",
          meetingId,
          ...data, // Allow other updates
        },
      });

      // Send email
      await sendBookingConfirmationEmail({
        to: existingBooking.email,
        name: existingBooking.name,
        scheduledTime: new Date(existingBooking.when),
        meetingId,
      }).catch((err) =>
        console.error("Failed to send confirmation email", err),
      );

      return updated;
    }

    // Handle Rescheduling Logic
    if (
      data.when &&
      new Date(data.when).getTime() !== new Date(existingBooking.when).getTime()
    ) {
      const newTime = new Date(data.when);

      const updated = await this.prisma.booking.update({
        where: { id },
        data: {
          when: newTime,
          ...data,
        },
      });

      await sendBookingUpdateEmail({
        to: existingBooking.email,
        name: existingBooking.name,
        newTime,
        meetingId: existingBooking.meetingId || undefined,
      }).catch((err) => console.error("Failed to send reschedule email", err));

      return updated;
    }

    // Standard update
    return await this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async cancelBooking(id: string) {
    const booking = await this.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await this.prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await sendBookingCancellationEmail({
      to: booking.email,
      name: booking.name,
      originalTime: booking.when,
    }).catch((err) => console.error("Failed to send cancellation email", err));

    return { message: "Booking cancelled successfully" };
  }
}
