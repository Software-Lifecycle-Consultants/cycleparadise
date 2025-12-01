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

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const guide = await prisma.cyclingGuide.findUnique({
      where: { id: params.id },
    });

    if (!guide) {
      return new Response(JSON.stringify({ error: 'Guide not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(guide), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Guide fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch guide' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { id } = params;

    const guideData: Record<string, any> = {};

    if (body.title !== undefined) {
      guideData.title = body.title;
      guideData.slug = generateSlug(body.title);
    }
    if (body.region !== undefined) guideData.region = body.region;
    if (body.content !== undefined) guideData.content = body.content;
    if (body.description !== undefined) guideData.description = body.description || null;
    if (body.shortDescription !== undefined)
      guideData.shortDescription = body.shortDescription || null;
    if (body.difficultyRating !== undefined) guideData.difficultyRating = body.difficultyRating;
    if (body.estimatedDuration !== undefined)
      guideData.estimatedDuration = body.estimatedDuration || null;
    if (body.estimatedDistance !== undefined)
      guideData.estimatedDistance = body.estimatedDistance
        ? parseFloat(body.estimatedDistance)
        : null;
    if (body.startingPoint !== undefined) guideData.startingPoint = body.startingPoint || null;
    if (body.endingPoint !== undefined) guideData.endingPoint = body.endingPoint || null;
    if (body.terrainType !== undefined) guideData.terrainType = body.terrainType || null;
    if (body.bestSeason !== undefined) guideData.bestSeason = body.bestSeason || null;
    if (body.highlights !== undefined) guideData.highlights = body.highlights || [];
    if (body.safetyTips !== undefined) guideData.safetyTips = body.safetyTips || [];
    if (body.gearChecklist !== undefined) guideData.gearChecklist = body.gearChecklist || [];
    if (body.nearbyAttractions !== undefined)
      guideData.nearbyAttractions = body.nearbyAttractions || [];
    if (body.routeSegments !== undefined) guideData.routeSegments = body.routeSegments || [];
    if (body.hydrationStops !== undefined) guideData.hydrationStops = body.hydrationStops || [];
    if (body.faqs !== undefined) guideData.faqs = body.faqs || [];
    if (body.mapImageUrl !== undefined) guideData.mapImageUrl = body.mapImageUrl || null;
    if (body.gpxFileUrl !== undefined) guideData.gpxFileUrl = body.gpxFileUrl || null;
    if (body.isPublished !== undefined) guideData.isPublished = body.isPublished;
    if (body.featured !== undefined) guideData.featured = body.featured;
    if (body.metaTitle !== undefined) guideData.metaTitle = body.metaTitle || null;
    if (body.metaDescription !== undefined)
      guideData.metaDescription = body.metaDescription || null;

    const updatedGuide = await prisma.cyclingGuide.update({
      where: { id },
      data: guideData,
    });

    return new Response(JSON.stringify(updatedGuide), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Guide update error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update guide' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.cyclingGuide.delete({
      where: { id: params.id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Guide deletion error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete guide' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
