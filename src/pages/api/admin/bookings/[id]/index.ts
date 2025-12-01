import type { APIRoute } from 'astro';
import { db } from '../../../../../lib/db/client';
import { handleApiError, ValidationError } from '../../../../../lib/errors';

export const DELETE: APIRoute = async ({ params, locals }) => {
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
    // Delete booking (cascade will delete related records)
    await db.prisma.booking.delete({
      where: { id: bookingId }
    });

    return new Response(
      JSON.stringify({
        message: 'Booking deleted successfully'
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
