export const baseTemplate = (content: string, title: string, headerColor = "linear-gradient(135deg, #2C3531 0%, #B48B7F 100%)") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: ${headerColor}; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Groom</h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your safe space for mental wellness</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
              
              <p style="margin: 24px 0 16px; color: #44504b; font-size: 14px; line-height: 1.6;">
                If you have any questions, please contact us at support@groom.com
              </p>
              
              <p style="margin: 0; color: #44504b; font-size: 14px; line-height: 1.6;">
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

export const confirmationTemplate = (params: {
  name: string;
  scheduledTime: string;
  meetingUrl: string;
  meetingId: string;
  service?: string;
}) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #2C3531; font-size: 24px; font-weight: 600;">✅ Your Session is Confirmed!</h2>
    
    <p style="margin: 0 0 16px; color: #44504b; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #44504b; font-size: 16px; line-height: 1.6;">
      Great news! Your mental wellness session has been confirmed. We're here to support you on your journey.
    </p>
    
    <table role="presentation" style="width: 100%; background-color: #f6fafb; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 24px;">
          <p style="margin: 0 0 12px; color: #6b6f6b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Session Details</p>
          
          ${params.service ? `
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">💆 Service Type</p>
            <p style="margin: 0; color: #2C3531; font-size: 18px; font-weight: 600;">${params.service}</p>
          </div>
          ` : ""}

          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">📅 Scheduled Time</p>
            <p style="margin: 0; color: #2C3531; font-size: 18px; font-weight: 600;">${params.scheduledTime}</p>
          </div>
          
          <div>
            <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">🔗 Meeting ID</p>
            <p style="margin: 0; color: #2C3531; font-size: 16px; font-family: monospace;">${params.meetingId}</p>
          </div>
        </td>
      </tr>
    </table>
    
    <table role="presentation" style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="text-align: center;">
          <a href="${params.meetingUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2C3531 0%, #B48B7F 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(44, 53, 49, 0.3);">
            Join Your Session
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #fff9f5; border-left: 4px solid #B48B7F; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #2C3531; font-size: 14px; font-weight: 600;">Before Your Session:</p>
      <ul style="margin: 0; padding-left: 20px; color: #44504b; font-size: 14px; line-height: 1.6;">
        <li style="margin-bottom: 8px;">Find a quiet, private space where you feel comfortable</li>
        <li style="margin-bottom: 8px;">Test your camera and microphone</li>
        <li style="margin-bottom: 8px;">Have a glass of water nearby</li>
        <li>Join a few minutes early if possible</li>
      </ul>
    </div>
  `;
  return baseTemplate(content, "Session Confirmed - Groom");
};

export const updateTemplate = (params: {
  name: string;
  newTime: string;
  meetingUrl: string;
  showLink: boolean;
  service?: string;
}) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #2C3531; font-size: 24px; font-weight: 600;">🗓️ Session Time Updated</h2>
    
    <p style="margin: 0 0 16px; color: #44504b; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #44504b; font-size: 16px; line-height: 1.6;">
      The time for your session has been updated. Here are the new details:
    </p>
    
    <table role="presentation" style="width: 100%; background-color: #f6fafb; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 24px;">
          <p style="margin: 0 0 12px; color: #6b6f6b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">New Session Details</p>
          
          ${params.service ? `
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">💆 Service Type</p>
            <p style="margin: 0; color: #2C3531; font-size: 18px; font-weight: 600;">${params.service}</p>
          </div>
          ` : ""}

          <div style="margin-bottom: ${params.showLink ? "16px" : "0"};">
            <p style="margin: 0 0 4px; color: #6b6f6b; font-size: 14px;">📅 New Scheduled Time</p>
            <p style="margin: 0; color: #2C3531; font-size: 18px; font-weight: 600;">${params.newTime}</p>
          </div>
        </td>
      </tr>
    </table>
    
    ${params.showLink ? `
    <table role="presentation" style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="text-align: center;">
          <a href="${params.meetingUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2C3531 0%, #B48B7F 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(44, 53, 49, 0.3);">
            Join Your Session
          </a>
        </td>
      </tr>
    </table>
    ` : ""}
    
    <p style="margin: 0 0 16px; color: #44504b; font-size: 14px; line-height: 1.6;">
      If this time doesn't work for you, please let us know or reschedule.
    </p>
  `;
  return baseTemplate(content, "Session Rescheduled - Groom");
};

export const cancellationTemplate = (params: {
  name: string;
  originalTime: string;
}) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #d32f2f; font-size: 24px; font-weight: 600;">🚫 Session Cancelled</h2>
    
    <p style="margin: 0 0 16px; color: #44504b; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #44504b; font-size: 16px; line-height: 1.6;">
      Your session scheduled for <strong>${params.originalTime}</strong> has been cancelled.
    </p>

    <p style="margin: 0 0 16px; color: #44504b; font-size: 14px; line-height: 1.6;">
       We understand that plans change. When you're ready, feel free to book a new session with us.
    </p>
  `;
  return baseTemplate(content, "Session Cancelled - Groom", "linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)");
};
