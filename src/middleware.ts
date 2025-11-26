import { defineMiddleware } from 'astro:middleware';
import { getUserFromSession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect, locals } = context;

  // Check route types
  const isAdminPageRoute =
    url.pathname.startsWith('/admin') && !url.pathname.startsWith('/api/admin');
  const isAdminAPIRoute = url.pathname.startsWith('/api/admin');
  const isLoginPage = url.pathname === '/admin/login';
  const isAuthAPI = url.pathname.startsWith('/api/admin/auth/');

  // Skip middleware for login page and auth API
  if (isLoginPage || isAuthAPI) {
    return next();
  }

  // Get session for all admin routes (pages and API)
  if (isAdminPageRoute || isAdminAPIRoute) {
    const sessionCookie = cookies.get('admin_session')?.value;
    const user = getUserFromSession(sessionCookie);

    // Debug logging
    if (isAdminAPIRoute) {
      console.log('[Middleware Debug] API Route:', url.pathname);
      console.log('[Middleware Debug] Session Cookie:', sessionCookie ? 'Present' : 'Missing');
      console.log('[Middleware Debug] User from session:', user ? `${user.email}` : 'null');
    }

    // For admin page routes, redirect if not authenticated
    if (isAdminPageRoute && !user) {
      return redirect('/admin/login?error=unauthorized');
    }

    // Set user in locals for both page and API routes
    // API routes will check locals.user and return 401 if not set
    if (user) {
      locals.user = user;
    }
  }

  return next();
});
