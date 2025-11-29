import type { APIRoute } from 'astro';
import { bookingRepository } from '../../../lib/db/repositories/bookings';
import { getPackageBySlug } from '../../../lib/utils/package-resolver';
import { handleApiError, ValidationError } from '../../../lib/errors';
import { emailService } from '../../../lib/email/service';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      packageSlug,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      customerCountry,
      numberOfGuests,
      startDate,
      endDate,
      specialRequests,
      totalPrice
    } = body;

    // Validate required fields
    if (!packageSlug || !customerFirstName || !customerLastName || !customerEmail ||
        !customerPhone || !numberOfGuests || !startDate || !endDate || !totalPrice) {
      throw new ValidationError('Missing required fields');
    }

    // Convert package slug to ID and get package details
    const tourPackage = await getPackageBySlug(packageSlug);
    if (!tourPackage) {
      throw new ValidationError('Package not found');
    }

    // Create booking
    const booking = await bookingRepository.create({
      packageId: tourPackage.id,
      customerName: `${customerFirstName} ${customerLastName}`,
      customerEmail,
      customerPhone,
      customerCountry,
      numberOfParticipants: parseInt(numberOfGuests),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      specialRequests,
      totalAmount: parseFloat(totalPrice),
      paymentMethod: 'CASH' // Default
    });

    // Send confirmation email (optional - can fail without breaking booking)
    try {
      await emailService.sendBookingConfirmation(
        booking.customerEmail,
        {
          bookingNumber: booking.bookingNumber,
          customerName: booking.customerName,
          packageTitle: tourPackage.title,
          startDate: new Date(booking.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          numberOfParticipants: booking.numberOfParticipants,
          totalAmount: booking.totalAmount
        }
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue - booking is still created
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bookingNumber: booking.bookingNumber,
          id: booking.id
        }
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
};
