import type {
  DifficultyLevel,
  TourPackage as PrismaTourPackage,
  CyclingGuide as PrismaCyclingGuide,
  Accommodation as PrismaAccommodation,
  Booking as PrismaBooking
} from '@prisma/client';

export interface MediaGalleryItem {
  url: string;
  alt?: string;
  type?: 'image' | 'video';
}

export interface MediaGallery {
  images?: MediaGalleryItem[];
  videos?: Array<{ url: string; title?: string; thumbnailUrl?: string }>;
}

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
  price?: number;
  maxParticipants: number;
  maxGroupSize?: number;
  includedServices?: any[]; // JSON array
  excludedServices?: any[]; // JSON array
  highlights?: string[];
  whatToBring?: string[];
  images?: string[];
  mediaGallery?: MediaGallery | any; // JSON object with image URLs
  videoUrl?: string | null;
  youtubeVideoId?: string;
  faqs?: Array<{ question: string; answer: string }>;
  reviews?: Array<{ author: string; role?: string; rating?: number; date?: string; content: string }>;
  supportContacts?: Array<{ label: string; value: string; href?: string }>;
  sustainability?: {
    carbonOffset?: string;
    communityImpact?: string;
    supportVehicle?: boolean;
  };
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
  description?: string;
  shortDescription?: string;
  routeMap?: any; // JSON object with GPS data
  difficultyRating: number; // 1-10
  difficultyLevel?: 'EASY' | 'INTERMEDIATE' | 'CHALLENGING';
  estimatedDistance?: number;
  estimatedDuration?: string;
  startingPoint?: string;
  endingPoint?: string;
  terrainType?: string;
  bestSeason?: string;
  bestTimeToVisit?: string;
  safetyTips?: any[]; // JSON array
  gearChecklist?: string[];
  nearbyAttractions?: string[];
  highlights?: string[];
  routeSegments?: Array<{ title?: string; distance?: string; description?: string }>;
  hydrationStops?: Array<{ name: string; type: string; notes?: string }>;
  pointsOfInterest?: any; // JSON object
  images?: any; // JSON object
  mapImageUrl?: string;
  gpxFileUrl?: string;
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
  search?: string;
  query?: string;
  region?: string;
  difficultyLevel?: DifficultyLevel;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
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
  search?: string;
  query?: string;
  region?: string;
  difficultyLevel?: 'EASY' | 'INTERMEDIATE' | 'CHALLENGING';
  difficultyRating?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
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
 * Booking search parameters
 */
export interface BookingSearchParams {
  query?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus?: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
  packageId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Booking search result with stats
 */
export interface BookingSearchResult {
  bookings: BookingWithPackage[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  stats: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

/**
 * Booking status history
 */
export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  previousStatus?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  newStatus?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  previousPayment?: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
  newPayment?: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
  notes?: string;
  changedBy: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
}

/**
 * Extended booking with relationships
 */
export interface BookingWithDetails extends BookingWithPackage {
  bookingAccommodations?: any[];
  statusHistory?: BookingStatusHistory[];
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