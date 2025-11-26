import bcrypt from 'bcryptjs';
import { prisma } from './db/connection';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
}

// Check if database is available
const hasDatabaseUrl = !!process.env.DATABASE_URL;

/**
 * Authenticate user with email and password
 * @param emailOrUsername - Email address
 * @param password - Plain text password
 * @returns User object if authenticated, null otherwise
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AdminUser | null> {
  // Check if database is available
  if (!hasDatabaseUrl) {
    console.warn('Database not configured, authentication disabled');
    return null;
  }

  try {
    // Find user by email
    const user = await prisma.adminUser.findFirst({
      where: {
        email,
        isActive: true // Only active users can log in
      }
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Return user (without password hash)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Hash a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Password hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a new admin user
 * @param email - Email address
 * @param firstName - First name
 * @param lastName - Last name
 * @param password - Plain text password
 * @returns Created user
 */
export async function createAdminUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<AdminUser | null> {
  if (!hasDatabaseUrl) {
    console.warn('Database not configured, cannot create user');
    return null;
  }

  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.adminUser.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        isActive: true
      }
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}

/**
 * Get user from session cookie
 * @param sessionCookie - Session cookie value
 * @returns Session user data or null
 */
export function getUserFromSession(sessionCookie: string | undefined): SessionUser | null {
  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie);
    
    // Validate session structure
    if (!session.userId || !session.email || !session.firstName || !session.lastName) {
      return null;
    }

    // Check if session is expired (24 hours default, or 14 days if remember me)
    const sessionAge = Date.now() - session.createdAt;
    const maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

    if (sessionAge > maxAge) {
      return null; // Session expired
    }

    return session;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

/**
 * Validate session and get user
 * @param sessionCookie - Session cookie value
 * @returns True if session is valid
 */
export function isAuthenticated(sessionCookie: string | undefined): boolean {
  return getUserFromSession(sessionCookie) !== null;
}
