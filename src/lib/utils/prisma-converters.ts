import type { Decimal } from '@prisma/client/runtime/library';

/**
 * Utility functions for converting Prisma types to our interface types
 */

/**
 * Convert Prisma Decimal to number
 */
export function decimalToNumber(decimal: Decimal | number | null): number {
  if (decimal === null || decimal === undefined) return 0;
  if (typeof decimal === 'number') return decimal;
  return decimal.toNumber();
}

/**
 * Convert Prisma TourPackage to our TourPackage interface
 */
export function convertPrismaTourPackage(prismaPackage: any): any {
  return {
    ...prismaPackage,
    basePrice: decimalToNumber(prismaPackage.basePrice),
    totalAmount: prismaPackage.totalAmount ? decimalToNumber(prismaPackage.totalAmount) : undefined
  };
}

/**
 * Convert Prisma Accommodation to our interface
 */
export function convertPrismaAccommodation(prismaAccommodation: any): any {
  return {
    ...prismaAccommodation,
    pricePerNight: decimalToNumber(prismaAccommodation.pricePerNight),
    rating: prismaAccommodation.rating ? decimalToNumber(prismaAccommodation.rating) : undefined
  };
}

/**
 * Convert Prisma Booking to our interface
 */
export function convertPrismaBooking(prismaBooking: any): any {
  return {
    ...prismaBooking,
    totalAmount: decimalToNumber(prismaBooking.totalAmount)
  };
}