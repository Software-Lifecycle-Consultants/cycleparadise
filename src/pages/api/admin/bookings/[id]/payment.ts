import type { APIRoute } from 'astro';
import { bookingRepository } from '../../../../../lib/db/repositories/bookings';
import { handleApiError, ValidationError } from '../../../../../lib/errors';
import { emailService } from '../../../../../lib/email/service';
import type { PaymentStatus } from '@prisma/client';

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
    const { paymentStatus, notes } = body;

    if (!paymentStatus) {
      throw new ValidationError('Payment status is required');
    }

    const validPaymentStatuses: PaymentStatus[] = ['PENDING', 'PAID', 'PARTIAL', 'REFUNDED'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new ValidationError('Invalid payment status value');
    }

    // Get current booking
    const currentBooking = await bookingRepository.findById(bookingId);
    if (!currentBooking) {
      throw new ValidationError('Booking not found');
    }

    // Update payment status
    const updatedBooking = await bookingRepository.updatePaymentStatus(
      bookingId,
      paymentStatus,
      notes,
      locals.user.userId
    );

    // Send email if payment is marked as PAID
    if (paymentStatus === 'PAID' && currentBooking.paymentStatus !== 'PAID') {
      await emailService.sendEmail(
        updatedBooking.customerEmail,
        {
          subject: `Payment Confirmed - ${updatedBooking.bookingNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">Payment Confirmed</h2>
              <p>Dear ${updatedBooking.customerName},</p>
              <p>We have received your payment for booking <strong>${updatedBooking.bookingNumber}</strong>.</p>

              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Payment Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Amount Paid:</strong> USD ${updatedBooking.totalAmount.toFixed(2)}</li>
                  <li><strong>Payment Status:</strong> ${paymentStatus}</li>
                </ul>
              </div>

              <p>Thank you for your payment. We look forward to seeing you on the tour!</p>

              <p>Best regards,<br>Cycle Paradise Team</p>
            </div>
          `
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: updatedBooking,
        message: 'Payment status updated successfully'
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
