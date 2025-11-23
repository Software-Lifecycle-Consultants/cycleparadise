import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma client instance for the application
 * Prevents multiple instances in development with hot reloading
 */
declare global {
  var __prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// Only initialize Prisma if DATABASE_URL is available
const hasDatabaseUrl = typeof process !== 'undefined' && Boolean(process.env?.DATABASE_URL);

if (hasDatabaseUrl) {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  } else {
    if (!global.__prisma) {
      global.__prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    prisma = global.__prisma;
  }
} else {
  // Create a dummy client that will never be called
  prisma = {} as PrismaClient;
}

export { prisma };

/**
 * Graceful shutdown handler for Prisma connection
 */
export async function disconnect(): Promise<void> {
  if (hasDatabaseUrl && prisma.$disconnect) {
    await prisma.$disconnect();
  }
}

/**
 * Database connection health check
 */
export async function healthCheck(): Promise<boolean> {
  if (!hasDatabaseUrl) {
    return false;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}