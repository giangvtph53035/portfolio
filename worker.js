// Cloudflare Worker for Laravel API proxy
// This worker will handle API requests and forward them to your Laravel backend

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);
    
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // API Routes mapping
    const apiRoutes = {
      '/api/projects': 'GET,POST',
      '/api/projects/': 'GET,PUT,DELETE',
      '/api/auth/login': 'POST',
      '/api/auth/logout': 'POST',
      '/api/auth/user': 'GET',
    };

    // Check if it's an API route
    const isApiRoute = Object.keys(apiRoutes).some(route => 
      url.pathname.startsWith(route) || url.pathname.match(new RegExp(route.replace('/', '\\/')))
    );

    if (isApiRoute) {
      // Forward to Laravel backend
      const backendUrl = env.BACKEND_URL || 'https://your-laravel-backend.com';
      const backendRequest = new Request(`${backendUrl}${url.pathname}${url.search}`, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? await request.arrayBuffer() : null,
      });

      const response = await fetch(backendRequest);
      
      // Add CORS headers to response
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      };

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          ...corsHeaders,
        },
      });
    }

    // For non-API routes, serve static content from Cloudflare Pages
    return new Response('Not Found', { status: 404 });
  },
};