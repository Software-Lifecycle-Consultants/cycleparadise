import { db } from '../client';
import type { CyclingGuide, GuideSearchParams } from '../../../types/models';
import { ValidationError } from '../../errors';
import type { Prisma } from '@prisma/client';

/**
 * Transform Prisma CyclingGuide to our typed model
 */
function transformGuide(raw: any): CyclingGuide {
  return {
    ...raw,
    estimatedDuration: raw.estimatedDuration ?? undefined,
    estimatedDistance: raw.estimatedDistance ?? undefined,
    startingPoint: raw.startingPoint ?? undefined,
    endingPoint: raw.endingPoint ?? undefined,
    terrainType: raw.terrainType ?? undefined,
    bestSeason: raw.bestSeason ?? undefined,
    hydrationStops: (raw.hydrationStops ?? undefined) as Array<{ name: string; type: string; notes?: string }> | undefined,
    safetyTips: (raw.safetyTips ?? undefined) as string[] | undefined,
    gearChecklist: (raw.gearChecklist ?? undefined) as string[] | undefined,
    nearbyAttractions: (raw.nearbyAttractions ?? undefined) as string[] | undefined,
    highlights: (raw.highlights ?? undefined) as string[] | undefined,
    routeSegments: (raw.routeSegments ?? undefined) as Array<{ title?: string; distance?: string; description?: string }> | undefined,
    routeMap: raw.routeMap ?? undefined,
    pointsOfInterest: raw.pointsOfInterest ?? undefined,
    images: raw.images ?? undefined,
    faqs: (raw.faqs ?? undefined) as Array<{ question: string; answer: string }> | undefined,
    mapImageUrl: raw.mapImageUrl ?? undefined,
    gpxFileUrl: raw.gpxFileUrl ?? undefined,
    description: raw.description ?? undefined,
    shortDescription: raw.shortDescription ?? undefined,
    metaTitle: raw.metaTitle ?? undefined,
    metaDescription: raw.metaDescription ?? undefined,
  };
}

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

      return guides.map(transformGuide);
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

      return guides.map(transformGuide);
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

      return guide ? transformGuide(guide) : null;
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

      return guides.map(transformGuide);
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

      return guides.map(transformGuide);
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