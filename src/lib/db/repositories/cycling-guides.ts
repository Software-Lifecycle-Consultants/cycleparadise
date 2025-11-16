import { db } from '../client';
import type { CyclingGuide, GuideSearchParams } from '../../../types/models';
import { ValidationError } from '../../errors';

/**
 * Repository for CyclingGuide operations
 */
export class CyclingGuideRepository {
  /**
   * Get all published cycling guides
   */
  async findMany(params: GuideSearchParams = {}): Promise<CyclingGuide[]> {
    const {
      query,
      region,
      difficultyRating,
      featured
    } = params;

    // Build where clause
    const where: any = {
      isPublished: true
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { region: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (region) {
      where.region = { contains: region, mode: 'insensitive' };
    }

    if (difficultyRating) {
      where.difficultyRating = { lte: difficultyRating };
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    try {
      const guides = await db.prisma.cyclingGuide.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return guides as CyclingGuide[];
    } catch (error) {
      console.error('Error finding cycling guides:', error);
      throw new ValidationError('Failed to retrieve cycling guides');
    }
  }

  /**
   * Get featured guides for homepage
   */
  async findFeatured(limit: number = 3): Promise<CyclingGuide[]> {
    try {
      const guides = await db.prisma.cyclingGuide.findMany({
        where: {
          isPublished: true,
          featured: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return guides as CyclingGuide[];
    } catch (error) {
      console.error('Error finding featured guides:', error);
      throw new ValidationError('Failed to retrieve featured guides');
    }
  }

  /**
   * Get a single guide by slug
   */
  async findBySlug(slug: string): Promise<CyclingGuide | null> {
    if (!slug) {
      throw new ValidationError('Guide slug is required');
    }

    try {
      const guide = await db.prisma.cyclingGuide.findUnique({
        where: {
          slug,
          isPublished: true
        }
      });

      return guide as CyclingGuide | null;
    } catch (error) {
      console.error('Error finding guide by slug:', error);
      throw new ValidationError('Failed to retrieve guide');
    }
  }

  /**
   * Get guides by region
   */
  async findByRegion(region: string, limit: number = 6): Promise<CyclingGuide[]> {
    if (!region) {
      throw new ValidationError('Region is required');
    }

    try {
      const guides = await db.prisma.cyclingGuide.findMany({
        where: {
          region: { contains: region, mode: 'insensitive' },
          isPublished: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return guides as CyclingGuide[];
    } catch (error) {
      console.error('Error finding guides by region:', error);
      throw new ValidationError('Failed to retrieve guides by region');
    }
  }

  /**
   * Search guides with full-text search
   */
  async search(query: string, limit: number = 10): Promise<CyclingGuide[]> {
    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters');
    }

    try {
      const guides = await db.prisma.cyclingGuide.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { region: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return guides as CyclingGuide[];
    } catch (error) {
      console.error('Error searching guides:', error);
      throw new ValidationError('Failed to search guides');
    }
  }

  /**
   * Get unique regions from guides
   */
  async getRegions(): Promise<string[]> {
    try {
      const result = await db.prisma.cyclingGuide.findMany({
        where: { isPublished: true },
        select: { region: true },
        distinct: ['region']
      });

      return result.map(r => r.region).filter(Boolean);
    } catch (error) {
      console.error('Error getting guide regions:', error);
      throw new ValidationError('Failed to retrieve guide regions');
    }
  }

  /**
   * Get difficulty rating range
   */
  async getDifficultyRange(): Promise<{ min: number; max: number }> {
    try {
      const result = await db.prisma.cyclingGuide.aggregate({
        where: { isPublished: true },
        _min: { difficultyRating: true },
        _max: { difficultyRating: true }
      });

      return {
        min: result._min.difficultyRating || 1,
        max: result._max.difficultyRating || 10
      };
    } catch (error) {
      console.error('Error getting difficulty range:', error);
      throw new ValidationError('Failed to retrieve difficulty range');
    }
  }
}

/**
 * Global repository instance
 */
export const cyclingGuideRepository = new CyclingGuideRepository();