import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    
    // Validate required fields
    if (!data.url || !data.metrics || !data.timestamp) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log performance metrics (in production, you'd save to database)
    const logEntry = {
      timestamp: new Date(data.timestamp).toISOString(),
      url: data.url,
      userAgent: data.userAgent,
      metrics: {
        ttfb: data.metrics.ttfb ? Math.round(data.metrics.ttfb) : null,
        fcp: data.metrics.fcp ? Math.round(data.metrics.fcp) : null,
        lcp: data.metrics.lcp ? Math.round(data.metrics.lcp) : null,
        fid: data.metrics.fid ? Math.round(data.metrics.fid) : null,
        cls: data.metrics.cls ? parseFloat(data.metrics.cls.toFixed(4)) : null,
        resources: data.metrics.resources || null
      }
    };

    // In development, log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log('Performance Metrics:', JSON.stringify(logEntry, null, 2));
    }

    // In production, you would:
    // 1. Save to a database (PostgreSQL, MongoDB, etc.)
    // 2. Send to analytics service (Google Analytics, DataDog, etc.)
    // 3. Send to monitoring service (Sentry, LogRocket, etc.)
    
    // Example database save (commented out - requires database setup):
    /*
    await db.performanceMetrics.create({
      data: {
        url: data.url,
        userAgent: data.userAgent,
        timestamp: new Date(data.timestamp),
        ttfb: data.metrics.ttfb,
        fcp: data.metrics.fcp,
        lcp: data.metrics.lcp,
        fid: data.metrics.fid,
        cls: data.metrics.cls,
        resourcesData: JSON.stringify(data.metrics.resources)
      }
    });
    */

    // Example analytics service integration:
    /*
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    }
    */

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Performance analytics error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET endpoint for retrieving performance data (for admin dashboard)
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);

    // In production, query from database
    // For now, return mock data structure
    const mockData = {
      metrics: [
        {
          timestamp: new Date().toISOString(),
          url: '/packages/hill-country-adventure',
          ttfb: 120,
          fcp: 850,
          lcp: 1200,
          fid: 45,
          cls: 0.02,
          userAgent: 'Mozilla/5.0...'
        }
      ],
      pagination: {
        page,
        limit,
        total: 1,
        totalPages: 1
      },
      summary: {
        avgTTFB: 120,
        avgFCP: 850,
        avgLCP: 1200,
        avgFID: 45,
        avgCLS: 0.02,
        totalPageViews: 1
      }
    };

    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Performance analytics GET error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};