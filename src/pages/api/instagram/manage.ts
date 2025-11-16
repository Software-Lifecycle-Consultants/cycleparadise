// Instagram API management endpoint
// This handles token refresh and validation

import type { APIRoute } from 'astro';
import instagramService from '../../../lib/services/instagram.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'refresh_token':
        const newToken = await instagramService.refreshAccessToken();
        if (newToken) {
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Token refreshed successfully',
            expires_in: '60 days'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to refresh token' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      case 'validate_token':
        const isValid = await instagramService.validateAccessToken();
        return new Response(JSON.stringify({ 
          success: true, 
          valid: isValid,
          message: isValid ? 'Token is valid' : 'Token is invalid or expired'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'clear_cache':
        instagramService.clearCache();
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Instagram cache cleared' 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid action. Supported actions: refresh_token, validate_token, clear_cache' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Instagram API management error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  try {
    // Get Instagram service status
    const isTokenValid = await instagramService.validateAccessToken();
    
    return new Response(JSON.stringify({
      success: true,
      status: {
        token_valid: isTokenValid,
        cache_active: true,
        last_check: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Instagram status check error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to check Instagram service status'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};