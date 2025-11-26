import type { APIRoute } from 'astro';
import { authenticateUser } from '../../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const remember = formData.get('remember') === 'true';

    // Validate required fields
    if (!email || !password) {
      return redirect('/admin/login?error=required');
    }

    // Attempt authentication
    const user = await authenticateUser(email, password);

    if (!user) {
      // Invalid credentials
      return redirect('/admin/login?error=invalid');
    }

    // Create session
    const sessionExpiry = remember
      ? 14 * 24 * 60 * 60 // 14 days in seconds
      : 24 * 60 * 60; // 24 hours in seconds

    // Set session cookie
    cookies.set('admin_session', JSON.stringify({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: Date.now()
    }), {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD, // HTTPS only in production
      sameSite: 'lax',
      maxAge: sessionExpiry
    });

    // Redirect to admin dashboard
    return redirect('/admin');

  } catch (error) {
    console.error('Login error:', error);
    return redirect('/admin/login?error=server');
  }
};
