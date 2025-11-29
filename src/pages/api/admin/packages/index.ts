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
        { shortDescription: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (region) {
      where.region = region;
    }

    if (difficulty) {
      where.difficultyLevel = difficulty;
    }

    if (status) {
      where.isActive = status === 'active';
    }

    const [packages, total] = await Promise.all([
      prisma.tourPackage.findMany({
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
          shortDescription: true,
          duration: true,
          difficultyLevel: true,
          region: true,
          basePrice: true,
          maxParticipants: true,
          isActive: true,
          featured: true,
          createdAt: true,
        },
      }),
      prisma.tourPackage.count({ where }),
    ]);

    return new Response(
      JSON.stringify({
        data: packages,
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
    console.error('Packages fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch packages' }), {
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

    // Generate slug from title
    const slug = generateSlug(body.title);

    const newPackage = await prisma.tourPackage.create({
      data: {
        title: body.title,
        slug,
        description: body.description || null,
        shortDescription: body.shortDescription || null,
        duration: body.duration,
        difficultyLevel: body.difficultyLevel,
        region: body.region,
        basePrice: body.basePrice,
        maxParticipants: body.maxParticipants,
        youtubeVideoId: body.youtubeVideoId || null,
        isActive: body.isActive ?? true,
        featured: body.featured ?? false,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        highlights: body.highlights || null,
        itinerary: body.itinerary || null,
        whatToBring: body.whatToBring || null,
        includedServices: body.includedServices || null,
        excludedServices: body.excludedServices || null,
        faqs: body.faqs || null,
        reviews: body.reviews || null,
        supportContacts: body.supportContacts || null,
        sustainability: body.sustainability || null,
        mediaGallery: body.mediaGallery || null,
      },
    });

    return new Response(JSON.stringify(newPackage), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Package creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create package' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
