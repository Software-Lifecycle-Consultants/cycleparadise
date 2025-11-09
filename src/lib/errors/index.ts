/**
 * Custom error types for the application
 */
export class ValidationError extends Error {
  public readonly field?: string;
  public readonly code: string;

  constructor(message: string, field?: string, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

export class DatabaseError extends Error {
  public readonly code: string;
  public readonly originalError?: any;

  constructor(message: string, code = 'DATABASE_ERROR', originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.originalError = originalError;
  }
}

export class AuthenticationError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
  }
}

export class BookingError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'BOOKING_ERROR') {
    super(message);
    this.name = 'BookingError';
    this.code = code;
  }
}

/**
 * API Error response interface
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  code: string;
  field?: string;
  details?: any;
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: any): Response {
  console.error('API Error:', error);

  let statusCode = 500;
  let errorResponse: ApiErrorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR'
  };

  if (error instanceof ValidationError) {
    statusCode = 400;
    errorResponse = {
      error: 'Validation Error',
      message: error.message,
      code: error.code,
      field: error.field
    };
  } else if (error instanceof DatabaseError) {
    statusCode = 500;
    errorResponse = {
      error: 'Database Error',
      message: 'A database error occurred',
      code: error.code
    };
  } else if (error instanceof AuthenticationError) {
    statusCode = 401;
    errorResponse = {
      error: 'Authentication Error',
      message: error.message,
      code: error.code
    };
  } else if (error instanceof BookingError) {
    statusCode = 400;
    errorResponse = {
      error: 'Booking Error',
      message: error.message,
      code: error.code
    };
  }

  return new Response(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Validation helper functions
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{8,15}$/;
  return phoneRegex.test(phone);
}

export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate;
}

export function validateAdvanceBooking(startDate: Date, minDays: number = 7): boolean {
  const today = new Date();
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= minDays;
}