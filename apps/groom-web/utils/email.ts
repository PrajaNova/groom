import crypto from "node:crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a hashed meeting ID from email and timestamp
 */
export function generateMeetingId(email: string): string {
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHash("sha256")
    .update(`${email}-${timestamp}`)
    .digest("hex");
  // Return first 12 characters for a clean meeting ID
  return hash.substring(0, 12);
}

/**
 * Generate Jitsi meeting URL
 */
export function generateJitsiUrl(meetingId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/connect/${meetingId}`;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(params: {
  to: string;
  name: string;
  scheduledTime: Date;
  meetingId: string;
}) {
  const { to, name, scheduledTime, meetingId } = params;
  const meetingUrl = generateJitsiUrl(meetingId);
  const formattedTime = scheduledTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Groom <noreply@groom.com>",
      to: [to],
      subject: "Your Session is Confirmed - Groom",
      html: generateEmailTemplate({
        name,
        scheduledTime: formattedTime,
        meetingUrl,
        meetingId,
      }),
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(params: {
  name: string;
  scheduledTime: string;
  meetingUrl: string;
  meetingId: string;
}) {
  const { name, scheduledTime, meetingUrl, meetingId } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2C3531 0%, #B48B7F 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Groom</h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your safe space for mental wellness</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #2C3531; font-size: 24px; font-weight: 600;">✅ Your Session is Confirmed!</h2>
              
              <p style="margin: 0 0 16px; color: #44504b; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #44504b; font-size: 16px; line-height: 1.6;">
                Great news! Your mental wellness session has been confirmed. We're here to support you on your journey.
              </p>
              
              <!-- Session Details Box -->
              <table role="presentation" style="width: 100%; background-color: #f6fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; color: #6b6f6b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Session Details</p>
                    
                    <div style="margin-bottom: 16px;">
                      <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">📅 Scheduled Time</p>
                      <p style="margin: 0; color: #2C3531; font-size: 18px; font-weight: 600;">${scheduledTime}</p>
                    </div>
                    
                    <div>
                      <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">🔗 Meeting ID</p>
                      <p style="margin: 0; color: #2C3531; font-size: 16px; font-family: monospace;">${meetingId}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Join Button -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${meetingUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2C3531 0%, #B48B7F 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(44, 53, 49, 0.3);">
                      Join Your Session
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Instructions -->
              <div style="background-color: #fff9f5; border-left: 4px solid #B48B7F; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 12px; color: #2C3531; font-size: 14px; font-weight: 600;">Before Your Session:</p>
                <ul style="margin: 0; padding-left: 20px; color: #44504b; font-size: 14px; line-height: 1.6;">
                  <li style="margin-bottom: 8px;">Find a quiet, private space where you feel comfortable</li>
                  <li style="margin-bottom: 8px;">Test your camera and microphone</li>
                  <li style="margin-bottom: 8px;">Have a glass of water nearby</li>
                  <li>Join a few minutes early if possible</li>
                </ul>
              </div>
              
              <p style="margin: 0 0 16px; color: #44504b; font-size: 14px; line-height: 1.6;">
                If you need to reschedule or have any questions, please contact us at support@groom.com
              </p>
              
              <p style="margin: 0; color: #44504b; font-size: 14px; line-height: 1.6;">
                We look forward to being there for you.
              </p>
              
              <p style="margin: 16px 0 0; color: #44504b; font-size: 14px; line-height: 1.6;">
                <strong>With care,</strong><br>
                Groom Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f6fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b6f6b; font-size: 12px;">
                © ${new Date().getFullYear()} Groom. All rights reserved.
              </p>
              <p style="margin: 0; color: #6b6f6b; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellationEmail(params: {
  to: string;
  name: string;
  originalTime: Date;
}) {
  const { to, name, originalTime } = params;
  const formattedTime = originalTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Groom <noreply@groom.com>",
      to: [to],
      subject: "Session Cancelled - Groom",
      html: generateCancellationEmailTemplate({
        name,
        originalTime: formattedTime,
      }),
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

/**
 * Send booking rescheduled (suggested time) email
 */
export async function sendBookingUpdateEmail(params: {
  to: string;
  name: string;
  newTime: Date;
  meetingId?: string;
}) {
  const { to, name, newTime, meetingId } = params;
  // If meeting ID is present, we can generate a link, otherwise just time update
  const meetingUrl = meetingId ? generateJitsiUrl(meetingId) : "#";

  const formattedTime = newTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Groom <noreply@groom.com>",
      to: [to],
      subject: "Session Rescheduled - Groom",
      html: generateUpdateEmailTemplate({
        name,
        newTime: formattedTime,
        meetingUrl,
        showLink: !!meetingId,
      }),
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

/**
 * Generate Cancellation Email Template
 */
function generateCancellationEmailTemplate(params: {
  name: string;
  originalTime: string;
}) {
  const { name, originalTime } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #d32f2f 0%, #ef5350 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Groom</h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your safe space for mental wellness</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #d32f2f; font-size: 24px; font-weight: 600;">🚫 Session Cancelled</h2>
              
              <p style="margin: 0 0 16px; color: #44504b; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #44504b; font-size: 16px; line-height: 1.6;">
                Your session scheduled for <strong>${originalTime}</strong> has been cancelled.
              </p>

              <p style="margin: 0 0 16px; color: #44504b; font-size: 14px; line-height: 1.6;">
                 We understand that plans change. When you're ready, feel free to book a new session with us.
              </p>
              
              <p style="margin: 0; color: #44504b; font-size: 14px; line-height: 1.6;">
                We're always here for you.
              </p>
              
              <p style="margin: 16px 0 0; color: #44504b; font-size: 14px; line-height: 1.6;">
                <strong>With care,</strong><br>
                Groom Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f6fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b6f6b; font-size: 12px;">
                © ${new Date().getFullYear()} Groom. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate Update/Reschedule Email Template
 */
function generateUpdateEmailTemplate(params: {
  name: string;
  newTime: string;
  meetingUrl: string;
  showLink: boolean;
}) {
  const { name, newTime, meetingUrl, showLink } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Rescheduled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2C3531 0%, #B48B7F 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Groom</h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your safe space for mental wellness</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #2C3531; font-size: 24px; font-weight: 600;">🗓️ Session Time Updated</h2>
              
              <p style="margin: 0 0 16px; color: #44504b; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #44504b; font-size: 16px; line-height: 1.6;">
                The time for your session has been updated. Here are the new details:
              </p>
              
              <!-- Session Details Box -->
              <table role="presentation" style="width: 100%; background-color: #f6fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; color: #6b6f6b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">New Session Details</p>
                    
                    <div style="margin-bottom: ${showLink ? "16px" : "0"};">
                      <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">📅 New Scheduled Time</p>
                      <p style="margin: 0; color: #2C3531; font-size: 18px; font-weight: 600;">${newTime}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              ${
                showLink
                  ? `
              <!-- Join Button -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${meetingUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2C3531 0%, #B48B7F 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(44, 53, 49, 0.3);">
                      Join Your Session
                    </a>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }
              
              <p style="margin: 0 0 16px; color: #44504b; font-size: 14px; line-height: 1.6;">
                If this time doesn't work for you, please let us know or reschedule.
              </p>
              
              <p style="margin: 16px 0 0; color: #44504b; font-size: 14px; line-height: 1.6;">
                <strong>With care,</strong><br>
                Groom Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f6fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b6f6b; font-size: 12px;">
                © ${new Date().getFullYear()} Groom. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
