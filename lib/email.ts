import nodemailer from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

interface InquiryData {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
}

// Get email configuration from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@abolishabortionmichigan.com';
const EMAIL_USER = process.env.EMAIL_USER || ADMIN_EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

// Send inquiry confirmation email to the user
export const sendInquiryConfirmationEmail = async (inquiry: InquiryData) => {
  if (!EMAIL_PASSWORD) {
    console.warn('Email password not configured. Skipping email send.');
    return { success: false, error: 'Email not configured' };
  }

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"Abolish Abortion Michigan" <${EMAIL_USER}>`,
      to: inquiry.email,
      bcc: ADMIN_EMAIL,
      subject: `Thank You for Contacting Abolish Abortion Michigan`,
      html: inquiryConfirmationEmailHtml(inquiry),
    });

    console.log(`Confirmation email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

// Send notification email to admin when new inquiry is received
export const sendInquiryNotificationEmail = async (inquiry: InquiryData) => {
  if (!EMAIL_PASSWORD) {
    console.warn('Email password not configured. Skipping email send.');
    return { success: false, error: 'Email not configured' };
  }

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"AAM Website" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Inquiry: ${inquiry.subject || 'General Inquiry'}`,
      html: inquiryNotificationEmailHtml(inquiry),
    });

    console.log(`Notification email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

// HTML template for user confirmation email
const inquiryConfirmationEmailHtml = (inquiry: InquiryData) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Inquiry</title>
  <style>
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #1a1a2e;
      padding: 30px 20px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #d4af37;
      letter-spacing: 1px;
    }
    .email-content {
      padding: 35px 40px;
      background-color: #ffffff;
    }
    h1 {
      color: #1a1a2e;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 25px;
    }
    .highlight {
      color: #8b0000;
      font-weight: 600;
    }
    .info-section {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #d4af37;
      margin: 20px 0;
    }
    .info-label {
      font-weight: 600;
      color: #555;
      display: inline-block;
      margin-right: 5px;
    }
    .footer {
      text-align: center;
      padding: 25px;
      color: #666666;
      font-size: 13px;
      background-color: #1a1a2e;
      color: #cccccc;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
    .note {
      border-left: 3px solid #d4af37;
      padding: 10px 15px;
      background-color: #f9f9f9;
      margin-top: 20px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td class="email-header" bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
              <div class="logo" style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Abolish Abortion Michigan</div>
            </td>
          </tr>

          <tr>
            <td class="email-content" style="padding: 35px 40px;">
              <h1 style="color: #1a1a2e; font-size: 24px; margin-top: 0; margin-bottom: 25px;">Thank You for Reaching Out</h1>
              <p>Hello <strong style="color: #8b0000;">${inquiry.name}</strong>,</p>
              <p>Thank you for contacting Abolish Abortion Michigan. We have received your inquiry and appreciate your interest in our mission to end abortion in Michigan.</p>

              <div class="info-section" style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #d4af37; margin: 20px 0;">
                <h3 style="color: #1a1a2e; margin-top: 0;">Your Inquiry Details</h3>
                <p><span class="info-label" style="font-weight: 600; color: #555;">Name:</span> ${inquiry.name}</p>
                <p><span class="info-label" style="font-weight: 600; color: #555;">Email:</span> ${inquiry.email}</p>
                ${inquiry.subject ? `<p><span class="info-label" style="font-weight: 600; color: #555;">Subject:</span> ${inquiry.subject}</p>` : ''}
                <p><span class="info-label" style="font-weight: 600; color: #555;">Message:</span></p>
                <p style="white-space: pre-wrap; background: #fff; padding: 10px; border-radius: 4px;">${inquiry.message}</p>
              </div>

              <div class="note" style="border-left: 3px solid #d4af37; padding: 10px 15px; background-color: #f9f9f9; margin-top: 20px; font-style: italic;">
                <p style="margin: 0;">A member of our team will review your message and respond within 1-2 business days. If you have an urgent matter, please reach out to us directly.</p>
              </div>

              <p style="margin-top: 25px;">In Christ,<br><strong>Abolish Abortion Michigan</strong></p>
            </td>
          </tr>

          <tr>
            <td class="footer" bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Abolish Abortion Michigan. All rights reserved.</p>
              <p style="margin: 0;"><a href="https://abolishabortionmichigan.com" style="color: #d4af37; text-decoration: none;">abolishabortionmichigan.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// HTML template for admin notification email
const inquiryNotificationEmailHtml = (inquiry: InquiryData) => {
  const formattedDate = new Date(inquiry.created_at).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry Received</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #8b0000;
      padding: 20px;
      text-align: center;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }
    .email-content {
      padding: 30px;
    }
    h1 {
      color: #1a1a2e;
      font-size: 22px;
      margin-top: 0;
    }
    .info-row {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      display: inline-block;
      width: 100px;
    }
    .message-box {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      border-left: 4px solid #8b0000;
    }
    .action-button {
      display: inline-block;
      background-color: #1a1a2e;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666666;
      font-size: 12px;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td class="email-header" bgcolor="#8b0000" style="padding: 20px; text-align: center;">
              <div class="logo" style="font-size: 20px; font-weight: bold; color: #ffffff;">New Inquiry Received</div>
            </td>
          </tr>

          <tr>
            <td class="email-content" style="padding: 30px;">
              <h1 style="color: #1a1a2e; font-size: 22px; margin-top: 0;">Inquiry Details</h1>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">From:</span>
                <span>${inquiry.name}</span>
              </div>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Email:</span>
                <span><a href="mailto:${inquiry.email}" style="color: #8b0000;">${inquiry.email}</a></span>
              </div>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Subject:</span>
                <span>${inquiry.subject || 'General Inquiry'}</span>
              </div>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Received:</span>
                <span>${formattedDate}</span>
              </div>

              <div class="message-box" style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #8b0000;">
                <strong style="color: #1a1a2e;">Message:</strong>
                <p style="white-space: pre-wrap; margin-top: 10px;">${inquiry.message}</p>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <a href="https://abolishabortionmichigan.com/admin/dashboard/inquiries" class="action-button" style="display: inline-block; background-color: #1a1a2e; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">View in Dashboard</a>
              </div>
            </td>
          </tr>

          <tr>
            <td class="footer" bgcolor="#f0f0f0" style="text-align: center; padding: 20px; color: #666666; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from the AAM Website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
