import type { APIRoute } from 'astro';
import { bookingRepository } from '../../../../../lib/db/repositories/bookings';
import { handleApiError, ValidationError } from '../../../../../lib/errors';
import { emailService } from '../../../../../lib/email/service';
import type { BookingStatus } from '@prisma/client';

export const POST: APIRoute = async ({ params, request, locals }) => {
  // Authentication check
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
    const { status, notes } = body;

    if (!status) {
      throw new ValidationError('Status is required');
    }

    // Validate status is a valid enum value
    const validStatuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status value');
    }

    // Get current booking for email
    const currentBooking = await bookingRepository.findById(bookingId);
    if (!currentBooking) {
      throw new ValidationError('Booking not found');
    }

    // Update status
    const updatedBooking = await bookingRepository.updateStatus(
      bookingId,
      status,
      notes,
      locals.user.userId
    );

    // Send automatic emails based on status change
    const shouldSendEmail = currentBooking.status !== status;

    if (shouldSendEmail) {
      if (status === 'CONFIRMED') {
        // Send confirmation email
        await emailService.sendBookingConfirmation(
          updatedBooking.customerEmail,
          {
            bookingNumber: updatedBooking.bookingNumber,
            customerName: updatedBooking.customerName,
            packageTitle: currentBooking.package.title,
            startDate: new Date(updatedBooking.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            numberOfParticipants: updatedBooking.numberOfParticipants,
            totalAmount: updatedBooking.totalAmount
          }
        );
      } else if (status === 'CANCELLED') {
        // Send cancellation email
        await emailService.sendEmail(
          updatedBooking.customerEmail,
          {
            subject: `Booking Cancellation - ${updatedBooking.bookingNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Booking Cancelled</h2>
                <p>Dear ${updatedBooking.customerName},</p>
                <p>We regret to inform you that your booking has been cancelled.</p>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Booking Details</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li><strong>Booking Number:</strong> ${updatedBooking.bookingNumber}</li>
                    <li><strong>Package:</strong> ${currentBooking.package.title}</li>
                  </ul>
                  ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
                </div>

                <p>If you have any questions, please contact us at ${process.env.CONTACT_EMAIL}</p>

                <p>Best regards,<br>Cycle Paradise Team</p>
              </div>
            `
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        data: updatedBooking,
        message: 'Status updated successfully'
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
