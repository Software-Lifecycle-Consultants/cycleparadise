import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Email configuration interface
 */
interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

/**
 * Email template interface
 */
interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

/**
 * Email service for sending notifications and confirmations
 */
export class EmailService {
  private transporter: Transporter;
  private fromEmail: string;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
      from: process.env.FROM_EMAIL || 'noreply@cycleparadise.lk'
    };

    this.fromEmail = config.from;

    // Create nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // Use SSL for port 465
      auth: {
        user: config.user,
        pass: config.password
      }
    });
  }

  /**
   * Send email with template
   */
  async sendEmail(
    to: string | string[],
    template: EmailTemplate,
    cc?: string[],
    bcc?: string[]
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: Array.isArray(to) ? to.join(', ') : to,
        cc: cc?.join(', '),
        bcc: bcc?.join(', '),
        subject: template.subject,
        html: template.html,
        text: template.text || this.stripHtml(template.html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(
    customerEmail: string,
    bookingDetails: {
      bookingNumber: string;
      customerName: string;
      packageTitle: string;
      startDate: string;
      numberOfParticipants: number;
      totalAmount: number;
    }
  ): Promise<boolean> {
    const template: EmailTemplate = {
      subject: `Booking Confirmation - ${bookingDetails.bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Booking Confirmation</h2>
          <p>Dear ${bookingDetails.customerName},</p>
          <p>Thank you for your booking with Cycle Paradise! Your booking request has been received and is being processed.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Booking Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Booking Number:</strong> ${bookingDetails.bookingNumber}</li>
              <li><strong>Package:</strong> ${bookingDetails.packageTitle}</li>
              <li><strong>Start Date:</strong> ${bookingDetails.startDate}</li>
              <li><strong>Participants:</strong> ${bookingDetails.numberOfParticipants}</li>
              <li><strong>Total Amount:</strong> LKR ${bookingDetails.totalAmount.toFixed(2)}</li>
            </ul>
          </div>
          
          <p>Our team will contact you within 24 hours to confirm your booking and provide payment instructions.</p>
          <p>If you have any questions, please contact us at ${process.env.CONTACT_EMAIL}</p>
          
          <p>Best regards,<br>Cycle Paradise Team</p>
        </div>
      `
    };

    return this.sendEmail(customerEmail, template);
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(
    subject: string,
    content: string,
    adminEmails: string[] = [process.env.ADMIN_EMAIL || 'admin@cycleparadise.lk']
  ): Promise<boolean> {
    const template: EmailTemplate = {
      subject: `[Cycle Paradise Admin] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Admin Notification</h2>
          ${content}
        </div>
      `
    };

    return this.sendEmail(adminEmails, template);
  }

  /**
   * Verify email service configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }

  /**
   * Strip HTML tags from string (fallback for text version)
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

/**
 * Global email service instance
 */
export const emailService = new EmailService();