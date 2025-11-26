import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const GET: APIRoute = async ({ locals }) => {
  // Check authentication
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const packages = await prisma.tourPackage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
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
    });

    return new Response(JSON.stringify(packages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Packages fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch packages' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
      },
    });

    return new Response(JSON.stringify(newPackage), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Package creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create package' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
