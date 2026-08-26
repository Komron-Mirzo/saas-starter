'use server';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.your-server.de',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    await transporter.sendMail({
      from: `"WorthFit" <komron@dis7.de>`,
      to: email,
      subject: `We've got your message, ${name}!`,
      text: `Hi ${name} ${surname},\n\nThank you for reaching out to WorthFit. We have received your message and will get back to you shortly.\n\nYour message:\n${message}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WorthFit</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 0;">
              <tr>
                <td align="center">
                  <!-- Email Container -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);">
                    
                    <!-- Pink Top Header with White Logo -->
                    <tr>
                      <td align="center" style="background-color: #FF6584; padding: 36px 40px;">
                        <h1 style="margin: 0; font-size: 26px; font-weight: 800; font-style: italic; letter-spacing: -0.5px; color: #ffffff;">
                          WORTHFIT
                        </h1>
                      </td>
                    </tr>

                    <!-- Minimalist Body Section -->
                    <tr>
                      <td style="padding: 40px 40px 30px 40px;">
                        <h2 style="margin: 0 0 16px 0; color: #111111; font-size: 20px; font-weight: 700;">
                          Hello ${name} ${surname},
                        </h2>
                        <p style="margin: 0 0 24px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                          Thank you for reaching out to us. We have successfully received your message and our team will get back to you shortly.
                        </p>

                        <!-- Submitted Message Card -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 14px;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 8px 0; color: #9CA3AF; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700;">
                                Your Submitted Message
                              </p>
                              <p style="margin: 0; color: #1F2937; font-size: 15px; line-height: 1.5; white-space: pre-wrap;">
                                ${message}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Elegant Bottom Footer -->
                    <tr>
                      <td align="center" style="padding: 30px 40px; background-color: #ffffff; border-top: 1px solid #F3F4F6;">
                        <p style="margin: 0 0 6px 0; color: #6B7280; font-size: 13px; font-weight: 500;">
                          Every small win becomes part of your powerful story.
                        </p>
                        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                          &copy; ${new Date().getFullYear()} WorthFit. All rights reserved.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Hetzner SMTP Error:', error);
    return { success: false, error: 'Failed to send email. Please check your network connection.' };
  }
}