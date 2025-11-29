import { db } from '../client';
import type { Booking, BookingWithPackage, BookingSearchParams, BookingSearchResult, BookingWithDetails } from '../../../types/models';
import { ValidationError } from '../../errors';
import { convertPrismaBooking } from '../../utils/prisma-converters';
import { generateBookingNumber } from '../../utils/booking-number';
import type { BookingStatus, PaymentStatus } from '@prisma/client';

/**
 * Repository for Booking operations
 */
export class BookingRepository {
  /**
   * Create a new booking
   */
  async create(data: {
    packageId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCountry?: string;
    numberOfParticipants: number;
    startDate: Date;
    endDate: Date;
    specialRequests?: string;
    totalAmount: number;
    paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';
  }): Promise<Booking> {
    try {
      // Generate unique booking number
      const bookingNumber = await generateBookingNumber(db.prisma);

      // Validate package exists
      const packageExists = await db.prisma.tourPackage.findUnique({
        where: { id: data.packageId },
        select: { id: true }
      });

      if (!packageExists) {
        throw new ValidationError('Package not found');
      }

      // Create booking
      const booking = await db.prisma.booking.create({
        data: {
          bookingNumber,
          packageId: data.packageId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerCountry: data.customerCountry,
          numberOfParticipants: data.numberOfParticipants,
          startDate: data.startDate,
          endDate: data.endDate,
          specialRequests: data.specialRequests,
          totalAmount: data.totalAmount,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: data.paymentMethod || 'CASH',
          submittedAt: new Date()
        }
      });

      return convertPrismaBooking(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Failed to create booking');
    }
  }

  /**
   * Find bookings with filtering and pagination
   */
  async findMany(params: BookingSearchParams = {}): Promise<BookingSearchResult> {
    const {
      query,
      status,
      paymentStatus,
      packageId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = params;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search across booking number, customer name, and email
    if (query) {
      where.OR = [
        { bookingNumber: { contains: query, mode: 'insensitive' } },
        { customerName: { contains: query, mode: 'insensitive' } },
        { customerEmail: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (packageId) where.packageId = packageId;

    // Date range filters
    if (startDate) {
      where.startDate = { gte: startDate };
    }
    if (endDate) {
      where.endDate = { lte: endDate };
    }

    try {
      // Execute queries in parallel for performance
      const [bookings, total, statsData] = await Promise.all([
        db.prisma.booking.findMany({
          where,
          include: {
            package: true  // Include package details
          },
          orderBy: { submittedAt: 'desc' },
          skip,
          take: limit
        }),
        db.prisma.booking.count({ where }),
        // Get status counts for dashboard stats
        db.prisma.booking.groupBy({
          by: ['status'],
          _count: true
        })
      ]);

      // Convert stats to object
      const stats = {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0
      };

      statsData.forEach((s: any) => {
        const statusKey = s.status.toLowerCase() as keyof typeof stats;
        if (statusKey in stats) {
          stats[statusKey] = s._count;
        }
      });

      return {
        bookings: bookings.map((b: any) => ({
          ...convertPrismaBooking(b),
          package: b.package
        })),
        total,
        page,
        limit,
        hasMore: skip + bookings.length < total,
        stats
      };
    } catch (error) {
      console.error('Error finding bookings:', error);
      throw new ValidationError('Failed to retrieve bookings');
    }
  }

  /**
   * Find booking by ID with all relationships
   */
  async findById(id: string): Promise<BookingWithDetails | null> {
    if (!id) {
      throw new ValidationError('Booking ID is required');
    }

    try {
      const booking = await db.prisma.booking.findUnique({
        where: { id },
        include: {
          package: true,
          bookingAccommodations: {
            include: {
              accommodation: true
            }
          },
          statusHistory: {
            include: {
              admin: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!booking) return null;

      return {
        ...convertPrismaBooking(booking),
        package: booking.package,
        bookingAccommodations: booking.bookingAccommodations,
        statusHistory: booking.statusHistory
      };
    } catch (error) {
      console.error('Error finding booking by ID:', error);
      throw new ValidationError('Failed to retrieve booking');
    }
  }

  /**
   * Find booking by booking number
   */
  async findByBookingNumber(bookingNumber: string): Promise<BookingWithPackage | null> {
    if (!bookingNumber) {
      throw new ValidationError('Booking number is required');
    }

    try {
      const booking = await db.prisma.booking.findUnique({
        where: { bookingNumber },
        include: {
          package: true
        }
      });

      return booking ? {
        ...convertPrismaBooking(booking),
        package: booking.package
      } : null;
    } catch (error) {
      console.error('Error finding booking by number:', error);
      throw new ValidationError('Failed to retrieve booking');
    }
  }

  /**
   * Update booking status with history tracking
   */
  async updateStatus(
    id: string,
    newStatus: BookingStatus,
    notes: string | undefined,
    adminUserId: string
  ): Promise<Booking> {
    if (!id) {
      throw new ValidationError('Booking ID is required');
    }

    try {
      // Get current booking
      const currentBooking = await db.prisma.booking.findUnique({
        where: { id }
      });

      if (!currentBooking) {
        throw new ValidationError('Booking not found');
      }

      // Update booking and create history record in a transaction
      const updatedBooking = await db.prisma.$transaction(async (tx) => {
        // Create status history record
        await tx.bookingStatusHistory.create({
          data: {
            bookingId: id,
            previousStatus: currentBooking.status,
            newStatus: newStatus,
            notes: notes || null,
            changedBy: adminUserId
          }
        });

        // Update booking
        const updated = await tx.booking.update({
          where: { id },
          data: {
            status: newStatus,
            confirmedAt: newStatus === 'CONFIRMED' ? new Date() : currentBooking.confirmedAt
          }
        });

        return updated;
      });

      return convertPrismaBooking(updatedBooking);
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new ValidationError('Failed to update booking status');
    }
  }

  /**
   * Update payment status with history tracking
   */
  async updatePaymentStatus(
    id: string,
    newPaymentStatus: PaymentStatus,
    notes: string | undefined,
    adminUserId: string
  ): Promise<Booking> {
    if (!id) {
      throw new ValidationError('Booking ID is required');
    }

    try {
      const currentBooking = await db.prisma.booking.findUnique({
        where: { id }
      });

      if (!currentBooking) {
        throw new ValidationError('Booking not found');
      }

      const updatedBooking = await db.prisma.$transaction(async (tx) => {
        // Create history record
        await tx.bookingStatusHistory.create({
          data: {
            bookingId: id,
            previousPayment: currentBooking.paymentStatus,
            newPayment: newPaymentStatus,
            notes: notes || null,
            changedBy: adminUserId
          }
        });

        // Update booking
        const updated = await tx.booking.update({
          where: { id },
          data: {
            paymentStatus: newPaymentStatus
          }
        });

        return updated;
      });

      return convertPrismaBooking(updatedBooking);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new ValidationError('Failed to update payment status');
    }
  }

  /**
   * Get upcoming bookings (for dashboard)
   */
  async findUpcoming(limit: number = 5): Promise<BookingWithPackage[]> {
    try {
      const bookings = await db.prisma.booking.findMany({
        where: {
          startDate: { gte: new Date() },
          status: { in: ['PENDING', 'CONFIRMED'] }
        },
        include: {
          package: true
        },
        orderBy: { startDate: 'asc' },
        take: limit
      });

      return bookings.map((b: any) => ({
        ...convertPrismaBooking(b),
        package: b.package
      }));
    } catch (error) {
      console.error('Error finding upcoming bookings:', error);
      throw new ValidationError('Failed to retrieve upcoming bookings');
    }
  }

  /**
   * Get bookings for export (no pagination)
   */
  async findForExport(params: BookingSearchParams = {}): Promise<BookingWithPackage[]> {
    const { query, status, paymentStatus, packageId, startDate, endDate } = params;
    const where: any = {};

    if (query) {
      where.OR = [
        { bookingNumber: { contains: query, mode: 'insensitive' } },
        { customerName: { contains: query, mode: 'insensitive' } },
        { customerEmail: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (packageId) where.packageId = packageId;
    if (startDate) where.startDate = { gte: startDate };
    if (endDate) where.endDate = { lte: endDate };

    try {
      // Limit to 1000 records to prevent memory issues
      const bookings = await db.prisma.booking.findMany({
        where,
        include: {
          package: true
        },
        orderBy: { submittedAt: 'desc' },
        take: 1000
      });

      return bookings.map((b: any) => ({
        ...convertPrismaBooking(b),
        package: b.package
      }));
    } catch (error) {
      console.error('Error finding bookings for export:', error);
      throw new ValidationError('Failed to retrieve bookings for export');
    }
  }

  /**
   * Get all unique packages (for filter dropdown)
   */
  async getPackages(): Promise<Array<{ id: string; title: string }>> {
    try {
      const packages = await db.prisma.tourPackage.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true
        },
        orderBy: { title: 'asc' }
      });

      return packages;
    } catch (error) {
      console.error('Error getting packages:', error);
      throw new ValidationError('Failed to retrieve packages');
    }
  }
}

export const bookingRepository = new BookingRepository();
