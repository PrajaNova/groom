export const baseTemplate = (content: string, title: string, headerColor = "#006442") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F0F2EF; color: #2C3531;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 10px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px; text-align: center; background-color: ${headerColor};">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">Groom</h1>
              <div style="margin: 10px auto 0; height: 3px; width: 40px; background-color: rgba(255,255,255,0.3); border-radius: 2px;"></div>
              <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">Your safe space for mental wellness</p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 48px 40px;">
              ${content}
              
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 10px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                  Have questions or need to reschedule? We're here to help.
                </p>
                <p style="margin: 0; color: #2C3531; font-size: 14px; line-height: 1.6;">
                  <strong>Groom Support Team</strong><br>
                  <a href="mailto:support@groom.global" style="color: #006442; text-decoration: none; font-weight: 600;">support@groom.global</a>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #FAFAF9; text-align: center; border-top: 1px solid #F3F4F6;">
              <p style="margin: 0 0 8px; color: #9CA3AF; font-size: 12px; font-weight: 500;">
                © ${new Date().getFullYear()} Groom. All rights reserved.
              </p>
              <p style="margin: 0; color: #D1D5DB; font-size: 11px;">
                This is an automated message. Please do not reply directly to this email.
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
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 12px; background-color: #ECFDF5; border-radius: 50%; margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="margin: 0; color: #111827; font-size: 26px; font-weight: 700;">Session Confirmed!</h2>
    </div>
    
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
      Your session is locked in! We're looking forward to connecting with you and supporting your journey.
    </p>
    
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <p style="margin: 0 0 16px; color: #9CA3AF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Session Details</p>
      
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        ${params.service ? `
        <tr>
          <td style="padding: 0 0 16px; vertical-align: top; width: 32px;">💆</td>
          <td style="padding: 0 0 16px;">
            <p style="margin: 0; color: #6B7280; font-size: 13px;">Service Type</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 16px; font-weight: 600;">${params.service}</p>
          </td>
        </tr>
        ` : ""}
        <tr>
          <td style="padding: 0 0 16px; vertical-align: top; width: 32px;">📅</td>
          <td style="padding: 0 0 16px;">
            <p style="margin: 0; color: #6B7280; font-size: 13px;">Scheduled Time</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 16px; font-weight: 600;">${params.scheduledTime}</p>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: top; width: 32px;">🔑</td>
          <td>
            <p style="margin: 0; color: #6B7280; font-size: 13px;">Meeting ID</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 15px; font-family: monospace;">${params.meetingId}</p>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${params.meetingUrl}" style="display: inline-block; padding: 18px 44px; background-color: #006442; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 16px; font-weight: 700; transition: background-color 0.2s;">
        Join Video Session
      </a>
    </div>

    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px;">
      <p style="margin: 0 0 12px; color: #92400E; font-size: 14px; font-weight: 700;">Before You Join:</p>
      <ul style="margin: 0; padding-left: 20px; color: #B45309; font-size: 14px; line-height: 1.6;">
        <li style="margin-bottom: 8px;">Use a quiet, private space.</li>
        <li style="margin-bottom: 8px;">Check your internet and camera.</li>
        <li>Have some water and a notepad ready.</li>
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
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 12px; background-color: #EFF6FF; border-radius: 50%; margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L15 15" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="9" stroke="#2563EB" stroke-width="2.5"/>
        </svg>
      </div>
      <h2 style="margin: 0; color: #111827; font-size: 26px; font-weight: 700;">Time Updated</h2>
    </div>
    
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
      We've updated the scheduled time for your session. Please check the new details below:
    </p>
    
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        ${params.service ? `
        <tr>
          <td style="padding: 0 0 16px; vertical-align: top; width: 32px;">💆</td>
          <td style="padding: 0 0 16px;">
            <p style="margin: 0; color: #6B7280; font-size: 13px;">Service Type</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 16px; font-weight: 600;">${params.service}</p>
          </td>
        </tr>
        ` : ""}
        <tr>
          <td style="vertical-align: top; width: 32px;">📅</td>
          <td>
            <p style="margin: 0; color: #6B7280; font-size: 13px;">New Scheduled Time</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 18px; font-weight: 700; color: #006442;">${params.newTime}</p>
          </td>
        </tr>
      </table>
    </div>
    
    ${params.showLink ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${params.meetingUrl}" style="display: inline-block; padding: 16px 40px; background-color: #006442; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 16px; font-weight: 700;">
        Join Your Session
      </a>
    </div>
    ` : ""}
    
    <p style="margin: 0; color: #6B7280; font-size: 14px; text-align: center;">
      If this new time doesn't work for you, please reach out to us.
    </p>
  `;
  return baseTemplate(content, "Session Rescheduled - Groom", "#2563EB");
};

export const cancellationTemplate = (params: {
  name: string;
  originalTime: string;
}) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 12px; background-color: #FEF2F2; border-radius: 50%; margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="margin: 0; color: #111827; font-size: 26px; font-weight: 700;">Session Cancelled</h2>
    </div>
    
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
      The session you had scheduled for <strong>${params.originalTime}</strong> has been cancelled.
    </p>

    <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; border: 1px dashed #D1D5DB; text-align: center;">
      <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
         We understand that things come up. When you're ready to pick back up, we're here for you.
      </p>
      <a href="https://groom.global/book-session" style="display: inline-block; margin-top: 16px; color: #006442; font-weight: 700; text-decoration: none;">Book a New Session &rarr;</a>
    </div>
  `;
  return baseTemplate(content, "Session Cancelled - Groom", "#DC2626");
};

export const receivedTemplate = (params: {
  name: string;
  scheduledTime: string;
  service?: string;
}) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 12px; background-color: #F3F4F6; border-radius: 50%; margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21V12M12 12L15 15M12 12L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="margin: 0; color: #111827; font-size: 26px; font-weight: 700;">Booking Received</h2>
    </div>
    
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi <strong>${params.name}</strong>,
    </p>
    
    <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
      We've received your booking request! Our team is currently reviewing the schedule to ensure everything is ready for your session.
    </p>
    
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        ${params.service ? `
        <tr>
          <td style="padding: 0 0 16px; vertical-align: top; width: 32px;">💆</td>
          <td style="padding: 0 0 16px;">
            <p style="margin: 0; color: #6B7280; font-size: 13px;">Requested Service</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 16px; font-weight: 600;">${params.service}</p>
          </td>
        </tr>
        ` : ""}
        <tr>
          <td style="vertical-align: top; width: 32px;">📅</td>
          <td>
            <p style="margin: 0; color: #6B7280; font-size: 13px;">Requested Time</p>
            <p style="margin: 2px 0 0; color: #111827; font-size: 16px; font-weight: 600;">${params.scheduledTime}</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #E0F2FE; border-radius: 10px; padding: 20px; text-align: center;">
      <p style="margin: 0; color: #0369A1; font-size: 14px; font-weight: 600;">
        Status: <span style="text-transform: uppercase;">Pending Approval</span>
      </p>
      <p style="margin: 8px 0 0; color: #0C4A6E; font-size: 14px;">
        You'll receive a confirmation email with the meeting link once approved.
      </p>
    </div>
  `;
  return baseTemplate(content, "Booking Received - Groom", "#4B5563");
};
