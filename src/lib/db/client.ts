import { prisma } from './connection';
import type { PrismaClient } from '@prisma/client';

/**
 * Database client wrapper with error handling and logging
 */
export class DatabaseClient {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  /**
   * Execute a function within a database transaction
   */
  async transaction<T>(
    fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
  ): Promise<T> {
    try {
      return await this.client.$transaction(fn);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  /**
   * Execute raw SQL with error handling
   */
  async executeRaw(sql: string, ...args: any[]): Promise<any> {
    try {
      return await this.client.$executeRawUnsafe(sql, ...args);
    } catch (error) {
      console.error('Raw query execution failed:', error);
      throw error;
    }
  }

  /**
   * Query raw SQL with error handling
   */
  async queryRaw(sql: string, ...args: any[]): Promise<any> {
    try {
      return await this.client.$queryRawUnsafe(sql, ...args);
    } catch (error) {
      console.error('Raw query failed:', error);
      throw error;
    }
  }

  /**
   * Get the underlying Prisma client
   */
  get prisma(): PrismaClient {
    return this.client;
  }
}

/**
 * Global database client instance
 */
export const db = new DatabaseClient();

/**
 * Export the Prisma client directly for simple operations
 */
export { prisma as client } from './connection';