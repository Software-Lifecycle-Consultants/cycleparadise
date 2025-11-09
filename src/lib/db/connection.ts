import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma client instance for the application
 * Prevents multiple instances in development with hot reloading
 */
declare global {
  var __prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

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

export { prisma };

/**
 * Graceful shutdown handler for Prisma connection
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Database connection health check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}