import type { PrismaClient } from '@prisma/client';

/**
 * Generate a unique booking number in format: CP-YYYYMMDD-XXXX
 *
 * Format breakdown:
 * - CP: Cycle Paradise
 * - YYYYMMDD: Date (for sorting and searching)
 * - XXXX: Sequential number for that day (padded to 4 digits)
 *
 * Example: CP-20251128-0001
 *
 * @param prisma - Prisma client instance
 * @returns Promise<string> - Unique booking number
 */
export async function generateBookingNumber(prisma: PrismaClient): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD

  // Get count of bookings created today with this date prefix
  const count = await prisma.booking.count({
    where: {
      bookingNumber: {
        startsWith: `CP-${dateStr}-`
      }
    }
  });

  // Generate next sequential number (padded to 4 digits)
  const sequence = String(count + 1).padStart(4, '0');

  return `CP-${dateStr}-${sequence}`;
}
