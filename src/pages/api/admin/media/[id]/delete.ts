import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/db/connection';
import { deleteFile } from '../../../../../lib/image-utils';

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Check authentication
  const sessionCookie = cookies.get('admin_session')?.value;
  if (!isAuthenticated(sessionCookie)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Find asset first
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return new Response(JSON.stringify({ error: 'Asset not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete from File System
    await deleteFile(asset.storageKey);

    // Delete from DB
    await prisma.mediaAsset.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Asset deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
