import type { APIRoute } from 'astro';

// Lightweight liveness endpoint for Docker/Caddy/CI health checks (no DB access on purpose).
export const prerender = false;

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
