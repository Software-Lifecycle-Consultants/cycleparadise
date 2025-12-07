import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db/connection';

export const GET: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const sessionCookie = cookies.get('admin_session')?.value;
  if (!isAuthenticated(sessionCookie)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get('page') || '1');
    const limit = Number.parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.mediaAsset.count({ where });

    // Get assets
    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Add full public URL to assets (assuming basic /uploads/ implementation)
    // If we switch to S3/Cloudinary, this URL generation logic would change
    const assetsWithUrls = assets.map((asset) => ({
      ...asset,
      url: `/uploads/${asset.storageKey}`,
    }));

    return new Response(
      JSON.stringify({
        data: assetsWithUrls,
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
    console.error('Error fetching media:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
