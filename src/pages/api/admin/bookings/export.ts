import type { APIRoute } from 'astro';
import { bookingRepository } from '../../../../lib/db/repositories/bookings';
import { handleApiError } from '../../../../lib/errors';
import type { BookingStatus, PaymentStatus } from '@prisma/client';

/**
 * Helper function to escape CSV values
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // If value contains comma, newline, or double quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Convert bookings to CSV format
 */
function bookingsToCSV(bookings: any[]): string {
  // CSV Headers
  const headers = [
    'Booking Number',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Customer Country',
    'Package Title',
    'Start Date',
    'End Date',
    'Duration (days)',
    'Participants',
    'Total Amount (USD)',
    'Booking Status',
    'Payment Status',
    'Payment Method',
    'Submitted Date',
    'Confirmed Date',
    'Special Requests'
  ];

  // Create CSV rows
  const rows = bookings.map(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return [
      escapeCSV(booking.bookingNumber),
      escapeCSV(booking.customerName),
      escapeCSV(booking.customerEmail),
      escapeCSV(booking.customerPhone),
      escapeCSV(booking.customerCountry || ''),
      escapeCSV(booking.package.title),
      escapeCSV(startDate.toLocaleDateString('en-US')),
      escapeCSV(endDate.toLocaleDateString('en-US')),
      escapeCSV(duration),
      escapeCSV(booking.numberOfParticipants),
      escapeCSV(booking.totalAmount.toFixed(2)),
      escapeCSV(booking.status),
      escapeCSV(booking.paymentStatus),
      escapeCSV(booking.paymentMethod),
      escapeCSV(new Date(booking.submittedAt).toLocaleString('en-US')),
      escapeCSV(booking.confirmedAt ? new Date(booking.confirmedAt).toLocaleString('en-US') : ''),
      escapeCSV(booking.specialRequests || '')
    ].join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}

export const GET: APIRoute = async ({ url, locals }) => {
  // Authentication check
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get filter parameters from URL
    const query = url.searchParams.get('q') || undefined;
    const status = url.searchParams.get('status') as BookingStatus | undefined;
    const paymentStatus = url.searchParams.get('paymentStatus') as PaymentStatus | undefined;
    const packageId = url.searchParams.get('packageId') || undefined;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Fetch bookings for export (limited to 1000 for safety)
    const bookings = await bookingRepository.findForExport({
      query,
      status,
      paymentStatus,
      packageId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    // Convert to CSV
    const csv = bookingsToCSV(bookings);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `bookings-export-${timestamp}.csv`;

    // Return CSV file
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
};
