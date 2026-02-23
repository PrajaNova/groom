import crypto from "node:crypto";
import type { FastifyInstance } from "fastify";
import { Resend } from "resend";
import {
  cancellationTemplate,
  confirmationTemplate,
  updateTemplate,
} from "../utils/templates/emailTemplates";

export class EmailService {
  private resend: Resend;

  constructor(private fastify: FastifyInstance) {
    // Standard approach: use env directly or via config if available
    const apiKey =
      process.env.RESEND_API_KEY || this.fastify.config?.email?.resendApiKey;
    this.resend = new Resend(apiKey);
  }

  /**
   * Generate a hashed meeting ID from email and timestamp
   */
  generateMeetingId(email: string): string {
    const timestamp = Date.now().toString();
    const hash = crypto
      .createHash("sha256")
      .update(`${email}-${timestamp}`)
      .digest("hex");
    return hash.substring(0, 12);
  }

  /**
   * Generate Jitsi meeting URL
   */
  private generateJitsiUrl(meetingId: string): string {
    const baseUrl = process.env.APP_URL || this.fastify.config?.app?.url;
    return `${baseUrl}/connect/${meetingId}`;
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmationEmail(params: {
    to: string;
    name: string;
    scheduledTime: Date;
    meetingId: string;
    service?: string;
  }) {
    const { to, name, scheduledTime, meetingId, service } = params;
    const meetingUrl = this.generateJitsiUrl(meetingId);
    const formattedTime = scheduledTime.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const fromEmail =
        process.env.EMAIL_FROM || this.fastify.config?.email?.from;
      const { data, error } = await this.resend.emails.send({
        from: fromEmail || "Groom <onboarding@resend.dev>",
        to: [to],
        subject: "Your Session is Confirmed - Groom",
        html: confirmationTemplate({
          name,
          scheduledTime: formattedTime,
          meetingUrl,
          meetingId,
          service,
        }),
      });

      if (error) {
        this.fastify.log.error({ error }, "Resend confirmation email error");
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      this.fastify.log.error({ error }, "Failed to send confirmation email");
      return { success: false, error };
    }
  }

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellationEmail(params: {
    to: string;
    name: string;
    originalTime: Date;
  }) {
    const { to, name, originalTime } = params;
    const formattedTime = originalTime.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const fromEmail =
        process.env.EMAIL_FROM || this.fastify.config?.email?.from;
      const { data, error } = await this.resend.emails.send({
        from: fromEmail || "Groom <onboarding@resend.dev>",
        to: [to],
        subject: "Session Cancelled - Groom",
        html: cancellationTemplate({
          name,
          originalTime: formattedTime,
        }),
      });

      if (error) {
        this.fastify.log.error({ error }, "Resend cancellation email error");
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      this.fastify.log.error({ error }, "Failed to send cancellation email");
      return { success: false, error };
    }
  }

  /**
   * Send booking rescheduled email
   */
  async sendBookingUpdateEmail(params: {
    to: string;
    name: string;
    newTime: Date;
    meetingId?: string;
    service?: string;
  }) {
    const { to, name, newTime, meetingId, service } = params;
    const meetingUrl = meetingId ? this.generateJitsiUrl(meetingId) : "#";

    const formattedTime = newTime.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const fromEmail =
        process.env.EMAIL_FROM || this.fastify.config?.email?.from;
      const { data, error } = await this.resend.emails.send({
        from: fromEmail || "Groom <onboarding@resend.dev>",
        to: [to],
        subject: "Session Rescheduled - Groom",
        html: updateTemplate({
          name,
          newTime: formattedTime,
          meetingUrl,
          showLink: !!meetingId,
          service,
        }),
      });

      if (error) {
        this.fastify.log.error({ error }, "Resend update email error");
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      this.fastify.log.error({ error }, "Failed to send update email");
      return { success: false, error };
    }
  }
}
