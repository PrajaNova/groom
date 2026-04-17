import crypto from "node:crypto";
import type { Booking, BookingStatus } from "@generated/client";
import { EmailService } from "@services/email.service";
import type { FastifyInstance } from "fastify";

export class BookingService {
  private emailService: EmailService;

  // PayPal Helper methods
  private get paypalApiUrl() {
    return process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
  }

  private async getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials missing");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(`${this.paypalApiUrl}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      this.fastify.log.error({ details: error }, "Failed to get PayPal token");
      throw new Error("Failed to authenticate with PayPal");
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  }

  constructor(private fastify: FastifyInstance) {
    this.emailService = new EmailService(this.fastify);

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      this.fastify.log.warn(
        "PayPal credentials missing. Payment features disabled.",
      );
    }
  }

  // Old create method (legacy or manual creation)
  async createBooking(data: {
    name: string;
    email: string;
    when: string | Date;
    service?: string;
    reason: string;
    userId?: string;
    status?: BookingStatus;
    meetingId?: string;
  }): Promise<Booking> {
    if (!data.email || !data.when || !data.name) {
      throw new Error("Email, Name, and When are required fields");
    }

    // Generate meeting ID
    const meetingId =
      data.meetingId || this.emailService.generateMeetingId(data.email);

    // Set status to pending (Admin needs to confirm)
    const booking = await this.fastify.prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        when: new Date(data.when),
        service: data.service,
        reason: data.reason ?? "No reason provided",
        userId: data.userId,
        status: data.status ?? "pending",
        meetingId,
      },
    });

    // Send "Booking Received" email
    await this.emailService
      .sendBookingReceivedEmail({
        to: booking.email,
        name: booking.name,
        scheduledTime: new Date(booking.when),
        service: booking.service || undefined,
      })
      .catch((err) =>
        this.fastify.log.error(err, "Failed to send booking received email"),
      );

    return booking;

    return booking;
  }

  // New Payment Flow: Step 1 - Initiate
  async initiateBooking(data: {
    name: string;
    email: string;
    when: string | Date;
    service?: string;
    reason: string;
    userId?: string;
    amount?: number; // Optional amount override
  }): Promise<{ booking: Booking; order: any }> {
    if (!process.env.PAYPAL_CLIENT_ID) {
      throw new Error("Payment gateway not configured");
    }

    // PayPal typically uses standard string decimals for amount (e.g., "50.00")
    // If incoming data.amount is provided (maybe in cents or paise), we should standardize to a human-readable decimal.
    // Let's use USD with a standard $50 for default, format: "50.00"
    const standardAmount = data.amount
      ? (data.amount / 100).toFixed(2)
      : "50.00";
    const currency = "USD";

    // Create PayPal Order
    const accessToken = await this.getPayPalAccessToken();
    const orderResponse = await fetch(
      `${this.paypalApiUrl}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: `booking_${Date.now()}`,
              amount: {
                currency_code: currency,
                value: standardAmount,
              },
            },
          ],
        }),
      },
    );

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      this.fastify.log.error(
        { details: errorText },
        "Failed to create PayPal order",
      );
      throw new Error("Failed to create PayPal order");
    }

    const order = (await orderResponse.json()) as any;

    // Create Booking (Payment Pending)
    const booking = await this.fastify.prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        when: new Date(data.when),
        service: data.service,
        reason: data.reason ?? "No reason provided",
        userId: data.userId,
        status: "payment_pending",
        orderId: order.id,
        amount: Math.round(parseFloat(standardAmount) * 100), // store internally as cents/paise
        currency: currency,
      },
    });

    return { booking, order };
  }

  // New Payment Flow: Step 2 - Verify & Confirm
  async verifyPayment(data: {
    bookingId: string;
    paypalOrderId: string;
  }): Promise<Booking> {
    const booking = await this.getBookingById(data.bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "confirmed") return booking; // Already confirmed

    // Capture PayPal Order
    const accessToken = await this.getPayPalAccessToken();
    const captureResponse = await fetch(
      `${this.paypalApiUrl}/v2/checkout/orders/${data.paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      this.fastify.log.error(
        { details: errorText },
        "Failed to capture PayPal order",
      );
      throw new Error("Payment capture failed. Try again.");
    }

    const captureData = (await captureResponse.json()) as any;

    if (captureData.status !== "COMPLETED") {
      throw new Error("Payment is not completed in PayPal");
    }

    const paymentId = captureData.purchase_units[0]?.payments?.captures[0]?.id;

    // Generate Meeting ID
    const meetingId = this.emailService.generateMeetingId(booking.email);

    // Update Booking
    const updated = await this.fastify.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "confirmed",
        paymentId: paymentId || data.paypalOrderId,
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
        service: updated.service || undefined,
        amount: (booking.amount || 0) / 100,
        currency: booking.currency || "USD",
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
          service: updated.service || undefined,
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
          service: updated.service || undefined,
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
