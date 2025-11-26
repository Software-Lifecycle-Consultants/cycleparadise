import type { APIRoute } from 'astro';
import { getUserFromSession } from '../../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  const sessionCookie = cookies.get('admin_session')?.value;
  const user = getUserFromSession(sessionCookie);

  if (user) {
    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify({
    authenticated: false
  }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
