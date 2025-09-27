// Cloudflare Worker cho Laravel API - MIỄN PHÍ 100%
// Worker này sẽ thay thế Laravel backend và chạy trực tiếp trên Cloudflare

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
            'Access-Control-Max-Age': '86400',
        };
        
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        try {
            // Route API requests
            if (url.pathname.startsWith('/api/')) {
                return handleApiRequest(request, env, corsHeaders);
            }
            
            // Default response
            return new Response('Cloudflare Worker API is running!', {
                headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
            });
            
        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};

async function handleApiRequest(request, env, corsHeaders) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // GitHub Projects API
    if (path.startsWith('/api/github/')) {
        return handleGitHubApi(request, env, corsHeaders);
    }
    
    // Projects API
    if (path.startsWith('/api/projects')) {
        return handleProjectsApi(request, env, corsHeaders);
    }
    
    // Health check
    if (path === '/api/health') {
        return new Response(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString() 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    return new Response(JSON.stringify({ 
        error: 'API endpoint not found',
        path: path 
    }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function handleGitHubApi(request, env, corsHeaders) {
    const url = new URL(request.url);
    const githubPath = url.pathname.replace('/api/github/', '');
    
    // Construct GitHub API URL
    const githubUrl = `https://api.github.com/${githubPath}${url.search}`;
    
    const headers = {
        'User-Agent': 'Portfolio-Cloudflare-Worker',
        'Accept': 'application/vnd.github.v3+json'
    };
    
    // Add GitHub token if available
    if (env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${env.GITHUB_TOKEN}`;
    }
    
    try {
        const githubRequest = new Request(githubUrl, {
            method: request.method,
            headers: headers
        });
        
        const response = await fetch(githubRequest);
        const data = await response.text();
        
        return new Response(data, {
            status: response.status,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: 'Failed to fetch from GitHub API',
            message: error.message 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

async function handleProjectsApi(request, env, corsHeaders) {
    const url = new URL(request.url);
    
    // You can replace this with Cloudflare D1 database queries
    // For now, we'll use GitHub API to get repositories
    if (env.GITHUB_USERNAME) {
        try {
            const githubUrl = `https://api.github.com/users/${env.GITHUB_USERNAME}/repos?sort=updated&per_page=50`;
            const headers = {
                'User-Agent': 'Portfolio-Cloudflare-Worker',
                'Accept': 'application/vnd.github.v3+json'
            };
            
            if (env.GITHUB_TOKEN) {
                headers['Authorization'] = `token ${env.GITHUB_TOKEN}`;
            }
            
            const response = await fetch(githubUrl, { headers });
            const repos = await response.json();
            
            // Transform GitHub repos to match your API format
            const projects = repos.map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || 'No description available',
                github_url: repo.html_url,
                demo_url: repo.homepage || null,
                technologies: repo.topics || [],
                featured: repo.stargazers_count > 0 || repo.name.includes('portfolio'),
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                language: repo.language
            }));
            
            return new Response(JSON.stringify({ 
                data: projects,
                total: projects.length 
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=600' // Cache for 10 minutes
                }
            });
            
        } catch (error) {
            return new Response(JSON.stringify({ 
                error: 'Failed to fetch projects',
                message: error.message 
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
    
    // Fallback static data
    const projects = [
        {
            id: 1,
            name: 'Portfolio Website',
            description: 'Personal portfolio built with Laravel and React, deployed on Cloudflare',
            github_url: 'https://github.com/giangvtph53035/portfolio',
            demo_url: null,
            technologies: ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'Cloudflare'],
            featured: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
            stargazers_count: 0,
            forks_count: 0,
            language: 'PHP'
        }
    ];
    
    return new Response(JSON.stringify({ 
        data: projects,
        total: projects.length 
    }), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}