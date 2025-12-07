import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Clear session cookie
  cookies.delete('admin_session', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  });

  // Redirect to login with success message
  return redirect('/admin/login?message=logged_out');
};
