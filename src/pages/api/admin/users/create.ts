import type { AdminRole } from '@prisma/client';
import type { APIRoute } from 'astro';
import { hashPassword, isAuthenticated } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db/connection';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies.get('admin_session')?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const { email, firstName, lastName, password, role, isActive } = data;

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), {
        status: 409,
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.adminUser.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        role: (role as AdminRole) || 'EDITOR',
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
