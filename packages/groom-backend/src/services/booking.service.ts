import type { Booking, BookingStatus } from "@generated/client";
import { EmailService } from "@services/email.service";
import type { FastifyInstance } from "fastify";
import Razorpay from "razorpay";
import crypto from "node:crypto";

export class BookingService {
  private emailService: EmailService;
  private razorpay?: Razorpay;

  constructor(private fastify: FastifyInstance) {
    this.emailService = new EmailService(this.fastify);
    
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } else {
      this.fastify.log.warn("Razorpay credentials missing. Payment features disabled.");
    }
  }

  // Old create method (legacy or manual creation)
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

    // Generate meeting ID
    const meetingId = data.meetingId || this.emailService.generateMeetingId(data.email);

    // Auto-confirm booking (skip payment for now)
    const booking = await this.fastify.prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        when: new Date(data.when),
        reason: data.reason ?? "No reason provided",
        userId: data.userId,
        status: data.status ?? "confirmed", // Auto-confirm
        meetingId,
      },
    });

    // Send confirmation email
    await this.emailService
      .sendBookingConfirmationEmail({
        to: booking.email,
        name: booking.name,
        scheduledTime: new Date(booking.when),
        meetingId,
      })
      .catch((err) =>
        this.fastify.log.error(err, "Failed to send confirmation email"),
      );

    return booking;
  }

  // New Payment Flow: Step 1 - Initiate
  async initiateBooking(data: {
    name: string;
    email: string;
    when: string | Date;
    reason: string;
    userId?: string;
    amount?: number; // Optional amount override
  }): Promise<{ booking: Booking; order: any }> {
    if (!this.razorpay) {
      throw new Error("Payment gateway not configured");
    }

    const amount = data.amount || 50000; // Default 500 INR (in paise)
    
    // Create Razorpay Order
    const order = await this.razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    });

    // Create Booking (Payment Pending)
    const booking = await this.fastify.prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        when: new Date(data.when),
        reason: data.reason ?? "No reason provided",
        userId: data.userId,
        status: "payment_pending",
        orderId: order.id,
        amount: amount,
        currency: "INR",
      },
    });

    return { booking, order };
  }

  // New Payment Flow: Step 2 - Verify & Confirm
  async verifyPayment(data: {
    bookingId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }): Promise<Booking> {
    const booking = await this.getBookingById(data.bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "confirmed") return booking; // Already confirmed

    if (!process.env.RAZORPAY_KEY_SECRET) throw new Error("Razorpay secret missing");

    // Verify Signature
    const body = booking.orderId + "|" + data.razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      throw new Error("Invalid payment signature");
    }

    // Generate Meeting ID
    const meetingId = this.emailService.generateMeetingId(booking.email);

    // Update Booking
    const updated = await this.fastify.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "confirmed",
        paymentId: data.razorpayPaymentId,
        meetingId,
      },
    });

    // Send Confirmation Email
    await this.emailService
      .sendBookingConfirmationEmail({
        to: updated.email,
        name: updated.name,
        scheduledTime: new Date(updated.when),
        meetingId,
      })
      .catch((err) =>
        this.fastify.log.error(err, "Failed to send confirmation email"),
      );

    return updated;
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

    // Handle Confirmation Logic (Manual Admin Confirm)
    if (data.status === "confirmed" && existingBooking.status !== "confirmed") {
      const meetingId =
        existingBooking.meetingId ||
        this.emailService.generateMeetingId(existingBooking.email);

      const updated = await this.fastify.prisma.booking.update({
        where: { id },
        data: {
          status: "confirmed",
          meetingId,
          ...data,
        },
      });

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
