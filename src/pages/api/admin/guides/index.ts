import { PrismaClient } from '@prisma/client';
import type { APIRoute } from 'astro';

const prisma = new PrismaClient();

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const GET: APIRoute = async ({ locals, request }) => {
  // Check authentication
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const region = url.searchParams.get('region');
    const difficulty = url.searchParams.get('difficulty');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (region) {
      where.region = region;
    }

    if (difficulty) {
      where.difficultyRating = parseInt(difficulty);
    }

    if (status) {
      where.isPublished = status === 'published';
    }

    const [guides, total] = await Promise.all([
      prisma.cyclingGuide.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          region: true,
          difficultyRating: true,
          estimatedDuration: true,
          bestSeason: true,
          isPublished: true,
          featured: true,
          createdAt: true,
        },
      }),
      prisma.cyclingGuide.count({ where }),
    ]);

    return new Response(
      JSON.stringify({
        data: guides,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Guides fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch guides' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();

    const guideData = {
      title: body.title,
      slug: body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      region: body.region,
      content: body.content,
      description: body.description || null,
      shortDescription: body.shortDescription || null,
      difficultyRating: body.difficultyRating,
      estimatedDuration: body.estimatedDuration || null,
      estimatedDistance: body.estimatedDistance ? parseFloat(body.estimatedDistance) : null,
      startingPoint: body.startingPoint || null,
      endingPoint: body.endingPoint || null,
      terrainType: body.terrainType || null,
      bestSeason: body.bestSeason || null,
      highlights: body.highlights || [],
      safetyTips: body.safetyTips || [],
      gearChecklist: body.gearChecklist || [],
      nearbyAttractions: body.nearbyAttractions || [],
      routeSegments: body.routeSegments || [],
      hydrationStops: body.hydrationStops || [],
      faqs: body.faqs || [],
      mapImageUrl: body.mapImageUrl || null,
      gpxFileUrl: body.gpxFileUrl || null,
      isPublished: body.isPublished,
      featured: body.featured,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
    };

    const guide = await prisma.cyclingGuide.create({
      data: guideData,
    });

    return new Response(JSON.stringify(guide), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Guide creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create guide' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
