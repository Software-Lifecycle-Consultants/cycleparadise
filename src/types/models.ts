import type { DifficultyLevel, TourPackage as PrismaTourPackage, CyclingGuide as PrismaCyclingGuide, Accommodation as PrismaAccommodation, Booking as PrismaBooking } from '@prisma/client';

/**
 * Tour Package model interface for type safety
 */
export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  itinerary?: any; // JSON object
  duration: number;
  difficultyLevel: DifficultyLevel;
  region: string;
  basePrice: number;
  maxParticipants: number;
  includedServices?: any[]; // JSON array
  excludedServices?: any[]; // JSON array
  mediaGallery?: any; // JSON object with image URLs
  youtubeVideoId?: string;
  isActive: boolean;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tour Package with relationships loaded
 */
export interface TourPackageWithBookings extends TourPackage {
  bookings: Booking[];
}

/**
 * Cycling Guide model interface
 */
export interface CyclingGuide {
  id: string;
  title: string;
  slug: string;
  region: string;
  content: string;
  routeMap?: any; // JSON object with GPS data
  difficultyRating: number; // 1-10
  estimatedDuration?: string;
  bestSeason?: string;
  safetyTips?: any[]; // JSON array
  pointsOfInterest?: any; // JSON object
  images?: any; // JSON object
  isPublished: boolean;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Accommodation model interface
 */
export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  type: 'HOTEL' | 'GUESTHOUSE' | 'RESORT' | 'HOMESTAY' | 'CAMPING';
  location: string;
  description?: string;
  amenities?: any[]; // JSON array
  pricePerNight: number;
  maxOccupancy: number;
  images?: any; // JSON object
  contactInfo?: any; // JSON object
  rating?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking model interface
 */
export interface Booking {
  id: string;
  bookingNumber: string;
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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  confirmationNotes?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';
  submittedAt: Date;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking with package details loaded
 */
export interface BookingWithPackage extends Booking {
  package: TourPackage;
}

/**
 * Package search and filter interfaces
 */
export interface PackageSearchParams {
  query?: string;
  region?: string;
  difficultyLevel?: DifficultyLevel;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  featured?: boolean;
}

export interface PackageSearchResult {
  packages: TourPackage[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Guide search parameters
 */
export interface GuideSearchParams {
  query?: string;
  region?: string;
  difficultyRating?: number;
  featured?: boolean;
}

/**
 * API Response interfaces
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Form submission interfaces
 */
export interface BookingFormData {
  packageId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry?: string;
  numberOfParticipants: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  specialRequests?: string;
  accommodationIds?: string[]; // Selected accommodation IDs
}