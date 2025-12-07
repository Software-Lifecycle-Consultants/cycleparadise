import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/db/connection';

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated(cookies.get('admin_session')?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400 });
  }

  try {
    // Prevent deleting self? (Optional, but good practice. Checking cookie user ID vs param ID)
    // For now, assuming basic delete.

    await prisma.adminUser.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
