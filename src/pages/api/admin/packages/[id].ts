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

// GET - Fetch single package
export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const package_ = await prisma.tourPackage.findUnique({
      where: { id: params.id },
    });

    if (!package_) {
      return new Response(JSON.stringify({ error: 'Package not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(package_), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Package fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch package' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PUT - Update package
export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();

    // Generate slug from title if title is provided
    const slug = body.title ? generateSlug(body.title) : undefined;

    const updatedPackage = await prisma.tourPackage.update({
      where: { id: params.id },
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

    return new Response(JSON.stringify(updatedPackage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Package update error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update package' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE - Delete package
export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.tourPackage.delete({
      where: { id: params.id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Package delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete package' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
