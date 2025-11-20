import { db } from '../client';
import type { TourPackage, PackageSearchParams, PackageSearchResult } from '../../../types/models';
import { ValidationError } from '../../errors';
import { convertPrismaTourPackage } from '../../utils/prisma-converters';
import type { DifficultyLevel } from '@prisma/client';

/**
 * Repository for TourPackage operations
 */
export class TourPackageRepository {
  /**
   * Get all active tour packages with optional filtering
   */
  async findMany(params: PackageSearchParams = {}): Promise<PackageSearchResult> {
    const {
      query,
      region,
      difficultyLevel,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      featured
    } = params;

    const page = 1; // Default for now
    const limit = 12; // Default packages per page
    const skip = (page - 1) * limit;

    // Build where clause dynamically
    const where: any = {
      isActive: true
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
        { region: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (region) {
      where.region = { contains: region, mode: 'insensitive' };
    }

    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = minDuration;
      if (maxDuration !== undefined) where.duration.lte = maxDuration;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    try {
      // Execute query and count in parallel
      const [packages, total] = await Promise.all([
        db.prisma.tourPackage.findMany({
          where,
          orderBy: [
            { featured: 'desc' }, // Featured packages first
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        db.prisma.tourPackage.count({ where })
      ]);

      return {
        packages: packages.map(convertPrismaTourPackage),
        total,
        page,
        limit,
        hasMore: skip + packages.length < total
      };
    } catch (error) {
      console.error('Error finding tour packages:', error);
      throw new ValidationError('Failed to retrieve tour packages');
    }
  }

  /**
   * Get featured packages for homepage
   */
  async findFeatured(limit: number = 3): Promise<TourPackage[]> {
    try {
      const packages = await db.prisma.tourPackage.findMany({
        where: {
          isActive: true,
          featured: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return packages.map(convertPrismaTourPackage);
    } catch (error) {
      console.error('Error finding featured packages:', error);
      throw new ValidationError('Failed to retrieve featured packages');
    }
  }

  /**
   * Get a single package by slug
   */
  async findBySlug(slug: string): Promise<TourPackage | null> {
    if (!slug) {
      throw new ValidationError('Package slug is required');
    }

    try {
      const packageData = await db.prisma.tourPackage.findUnique({
        where: {
          slug,
          isActive: true
        }
      });

      return packageData ? convertPrismaTourPackage(packageData) : null;
    } catch (error) {
      console.error('Error finding package by slug:', error);
      throw new ValidationError('Failed to retrieve package');
    }
  }

  /**
   * Get package by ID
   */
  async findById(id: string): Promise<TourPackage | null> {
    if (!id) {
      throw new ValidationError('Package ID is required');
    }

    try {
      const packageData = await db.prisma.tourPackage.findUnique({
        where: {
          id,
          isActive: true
        }
      });

      return packageData ? convertPrismaTourPackage(packageData) : null;
    } catch (error) {
      console.error('Error finding package by ID:', error);
      throw new ValidationError('Failed to retrieve package');
    }
  }

  /**
   * Get packages by region
   */
  async findByRegion(region: string, limit: number = 6): Promise<TourPackage[]> {
    if (!region) {
      throw new ValidationError('Region is required');
    }

    try {
      const packages = await db.prisma.tourPackage.findMany({
        where: {
          region: { contains: region, mode: 'insensitive' },
          isActive: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return packages.map(convertPrismaTourPackage);
    } catch (error) {
      console.error('Error finding packages by region:', error);
      throw new ValidationError('Failed to retrieve packages by region');
    }
  }

  /**
   * Get packages by difficulty level
   */
  async findByDifficulty(difficulty: DifficultyLevel, limit: number = 6): Promise<TourPackage[]> {
    try {
      const packages = await db.prisma.tourPackage.findMany({
        where: {
          difficultyLevel: difficulty,
          isActive: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return packages.map(convertPrismaTourPackage);
    } catch (error) {
      console.error('Error finding packages by difficulty:', error);
      throw new ValidationError('Failed to retrieve packages by difficulty');
    }
  }

  /**
   * Search packages with full-text search
   */
  async search(query: string, limit: number = 10): Promise<TourPackage[]> {
    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters');
    }

    try {
      const packages = await db.prisma.tourPackage.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { region: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return packages.map(convertPrismaTourPackage);
    } catch (error) {
      console.error('Error searching packages:', error);
      throw new ValidationError('Failed to search packages');
    }
  }

  /**
   * Get unique regions for filtering
   */
  async getRegions(): Promise<string[]> {
    try {
      const result = await db.prisma.tourPackage.findMany({
        where: { isActive: true },
        select: { region: true },
        distinct: ['region']
      });

      return result.map(r => r.region).filter(Boolean);
    } catch (error) {
      console.error('Error getting regions:', error);
      throw new ValidationError('Failed to retrieve regions');
    }
  }

  /**
   * Get price range for filtering
   */
  async getPriceRange(): Promise<{ min: number; max: number }> {
    try {
      const result = await db.prisma.tourPackage.aggregate({
        where: { isActive: true },
        _min: { basePrice: true },
        _max: { basePrice: true }
      });

      return {
        min: Number(result._min.basePrice) || 0,
        max: Number(result._max.basePrice) || 1000
      };
    } catch (error) {
      console.error('Error getting price range:', error);
      throw new ValidationError('Failed to retrieve price range');
    }
  }

  /**
   * Get duration range for filtering
   */
  async getDurationRange(): Promise<{ min: number; max: number }> {
    try {
      const result = await db.prisma.tourPackage.aggregate({
        where: { isActive: true },
        _min: { duration: true },
        _max: { duration: true }
      });

      return {
        min: Number(result._min.duration) || 0,
        max: Number(result._max.duration) || 0
      };
    } catch (error) {
      console.error('Error getting duration range:', error);
      throw new ValidationError('Failed to retrieve duration range');
    }
  }
}

/**
 * Global repository instance
 */
export const tourPackageRepository = new TourPackageRepository();