import { defineMiddleware } from 'astro:middleware';
import { getUserFromSession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect, locals } = context;

  // Check if route is an admin route
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginPage = url.pathname === '/admin/login';
  const isAuthAPI = url.pathname.startsWith('/api/admin/auth/');

  // Skip middleware for login page and auth API
  if (isLoginPage || isAuthAPI) {
    return next();
  }

  // Check authentication for admin routes
  if (isAdminRoute) {
    const sessionCookie = cookies.get('admin_session')?.value;
    const user = getUserFromSession(sessionCookie);

    if (!user) {
      // Not authenticated, redirect to login
      return redirect('/admin/login?error=unauthorized');
    }

    // Add user to locals for access in pages
    locals.user = user;
  }

  return next();
});
