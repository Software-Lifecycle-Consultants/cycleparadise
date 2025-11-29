import type { APIRoute } from 'astro';
import { bookingRepository } from '../../../../../lib/db/repositories/bookings';
import { handleApiError, ValidationError } from '../../../../../lib/errors';
import { emailService } from '../../../../../lib/email/service';

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const bookingId = params.id;
  if (!bookingId) {
    return new Response(JSON.stringify({ error: 'Booking ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { template, subject, message } = body;

    // Get booking details
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ValidationError('Booking not found');
    }

    let emailSent = false;
    let emailError: string | null = null;

    // Wrap email sending in try-catch to prevent service failures from crashing
    try {
      if (template === 'confirmation') {
        // Send booking confirmation
        emailSent = await emailService.sendBookingConfirmation(
          booking.customerEmail,
          {
            bookingNumber: booking.bookingNumber,
            customerName: booking.customerName,
            packageTitle: booking.package.title,
            startDate: new Date(booking.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            numberOfParticipants: booking.numberOfParticipants,
            totalAmount: booking.totalAmount
          }
        );
      } else if (template === 'cancellation') {
        // Send cancellation notice
        emailSent = await emailService.sendEmail(
          booking.customerEmail,
          {
            subject: `Booking Cancellation - ${booking.bookingNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Booking Cancelled</h2>
                <p>Dear ${booking.customerName},</p>
                <p>Your booking ${booking.bookingNumber} for ${booking.package.title} has been cancelled.</p>
                <p>If you have any questions, please contact us.</p>
                <p>Best regards,<br>Cycle Paradise Team</p>
              </div>
            `
          }
        );
      } else if (template === 'custom') {
        // Send custom email
        if (!subject || !message) {
          throw new ValidationError('Subject and message are required for custom emails');
        }

        emailSent = await emailService.sendEmail(
          booking.customerEmail,
          {
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #22c55e;">Message from Cycle Paradise</h2>
                <p>Dear ${booking.customerName},</p>
                <div style="white-space: pre-wrap;">${message}</div>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #6b7280;">
                  Regarding booking: ${booking.bookingNumber}<br>
                  Package: ${booking.package.title}
                </p>
                <p>Best regards,<br>Cycle Paradise Team</p>
              </div>
            `
          }
        );
      } else {
        throw new ValidationError('Invalid email template');
      }
    } catch (emailServiceError) {
      // Capture email service errors without crashing the endpoint
      emailError = emailServiceError instanceof Error
        ? emailServiceError.message
        : 'Email service unavailable';
      console.error('Email sending failed:', emailServiceError);
    }

    // Return appropriate response based on email result
    if (!emailSent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: emailError || 'Failed to send email. Please check email configuration.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
};
