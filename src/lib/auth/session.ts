import { db } from '../db/client';
import type { APIRoute } from 'astro';

/**
 * Session data interface
 */
interface SessionData {
  userId: string;
  email: string;
  role: string;
  loginTime: number;
}

/**
 * Session management service
 */
export class SessionManager {
  private readonly sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Create a new session for authenticated user
   */
  async createSession(userId: string, email: string, role: string): Promise<string> {
    const sessionId = this.generateSessionId();
    const sessionData: SessionData = {
      userId,
      email,
      role,
      loginTime: Date.now()
    };

    const expiresAt = new Date(Date.now() + this.sessionDuration);

    // Store session in database
    await db.prisma.session.create({
      data: {
        id: sessionId,
        sessionId: sessionId,
        data: JSON.stringify(sessionData),
        expiresAt
      }
    });

    return sessionId;
  }

  /**
   * Validate and retrieve session data
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const session = await db.prisma.session.findUnique({
        where: { sessionId }
      });

      if (!session) {
        return null;
      }

      // Check if session has expired
      if (session.expiresAt < new Date()) {
        await this.destroySession(sessionId);
        return null;
      }

      return JSON.parse(session.data) as SessionData;
    } catch (error) {
      console.error('Session retrieval failed:', error);
      return null;
    }
  }

  /**
   * Extend session expiry time
   */
  async extendSession(sessionId: string): Promise<boolean> {
    try {
      const expiresAt = new Date(Date.now() + this.sessionDuration);
      
      await db.prisma.session.update({
        where: { sessionId },
        data: { expiresAt }
      });

      return true;
    } catch (error) {
      console.error('Session extension failed:', error);
      return false;
    }
  }

  /**
   * Destroy session (logout)
   */
  async destroySession(sessionId: string): Promise<boolean> {
    try {
      await db.prisma.session.delete({
        where: { sessionId }
      });
      return true;
    } catch (error) {
      console.error('Session destruction failed:', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      await db.prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  }

  /**
   * Generate a secure session ID
   */
  private generateSessionId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * Middleware function to protect admin routes
 */
export function requireAdminAuth(handler: APIRoute): APIRoute {
  return async (context) => {
    const { request, cookies } = context;

    // Get session ID from cookie
    const sessionId = cookies.get('session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate session
    const sessionManager = new SessionManager();
    const sessionData = await sessionManager.getSession(sessionId);

    if (!sessionData) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extend session on valid requests
    await sessionManager.extendSession(sessionId);

    // Add session data to request context
    (request as any).session = sessionData;

    return handler(context);
  };
}

/**
 * Middleware to check if user has admin role
 */
export function requireAdminRole(handler: APIRoute): APIRoute {
  return requireAdminAuth(async (context) => {
    const sessionData = (context.request as any).session as SessionData;

    if (sessionData.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return handler(context);
  });
}

/**
 * Global session manager instance
 */
export const sessionManager = new SessionManager();