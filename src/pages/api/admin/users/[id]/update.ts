import type { AdminRole } from '@prisma/client';
import type { APIRoute } from 'astro';
import { hashPassword, isAuthenticated } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/db/connection';

export const PUT: APIRoute = async ({ request, params, cookies }) => {
  if (!isAuthenticated(cookies.get('admin_session')?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400 });
  }

  try {
    const data = await request.json();
    const { email, firstName, lastName, password, role, isActive } = data;

    const updateData: any = {
      email,
      firstName,
      lastName,
      role: role as AdminRole,
      isActive,
    };

    // Only update password if provided
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
