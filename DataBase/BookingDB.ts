import type { Booking } from "@prisma/client";
import { prisma, safeDbTransaction } from "./BaseDb";

const createBooking = async (booking: Partial<Booking>) => {
  console.log(booking);
  return safeDbTransaction(async () => {
    if (!booking.email || !booking.when || !booking.name) {
      throw new Error("Email and When are required fields");
    }
    try {
      const existing = await prisma.booking.findFirst({
        where: {
          email: booking.email,
          status: { in: ["pending", "confirmed"] },
        },
        orderBy: { createdAt: "desc" },
      });

      if (existing) {
        return existing;
      }
      return await prisma.booking.create({
        data: {
          name: booking.name,
          email: booking.email,
          when: new Date(booking.when as string | Date),
          reason: booking.reason ?? "No reason provided",
          status: booking.status ?? "pending",
          meetingId: booking.meetingId ?? undefined,
        },
      });
    } catch (e) {
      throw new Error(`Failed to create booking: ${(e as Error).message}`);
    }
  });
};

const updateBooking = (booking: Partial<Booking>) => {
  return safeDbTransaction(async () => {
    if (!booking.id) {
      throw new Error("Booking not found");
    }

    const updatedBooking = prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        ...booking,
      },
    });

    return updatedBooking;
  });
};

const getBookingById = (id: string) => {
  return safeDbTransaction(async () => {
    if (!id) {
      throw new Error("Booking ID is required");
    }

    const booking = prisma.booking.findUnique({
      where: {
        id: id,
      },
    });

    return booking;
  });
};

const getBookings = (filters?: {
  status?: string[];
  fromDate?: Date;
  sort?: "asc" | "desc";
}) => {
  return safeDbTransaction(async () => {
    // biome-ignore lint/suspicious/noExplicitAny: can not add type for booking where input
    const where: any = {};

    if (filters?.status) {
      where.status = { in: filters.status };
    }

    if (filters?.fromDate) {
      where.when = { gte: filters.fromDate };
    }

    return prisma.booking.findMany({
      where,
      orderBy: { when: filters?.sort ?? "asc" },
    });
  });
};

const getBookingsByEmail = (email: string) => {
  return safeDbTransaction(async () => {
    if (!email) {
      throw new Error("Email is required");
    }

    const bookings = prisma.booking.findMany({
      where: {
        email: email,
      },
    });

    return bookings;
  });
};

const deleteBooking = (id: string) => {
  return safeDbTransaction(async () => {
    if (!id) {
      throw new Error("Booking ID is required");
    }

    return prisma.booking.delete({
      where: {
        id: id,
      },
    });
  });
};

const BookingDB = {
  createBooking,
  updateBooking,
  getBookingById,
  getBookings,
  getBookingsByEmail,
  deleteBooking,
};

export default BookingDB;
