<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class GitHubProjectService
{
    private $client;
    private $token;
    private $username;

    public function __construct()
    {
        $this->client = new Client();
        $this->token = config('services.github.token');
        $this->username = config('services.github.username');
    }

    /**
     * Get all GitHub repositories formatted as projects
     */
    public function getAllProjects(array $filters = [])
    {
        try {
            // Validate token and username
            if (!$this->token || !$this->username) {
                return [
                    'success' => false,
                    'message' => 'GitHub token hoặc username chưa được cấu hình',
                    'data' => []
                ];
            }

            // Cache key
            $cacheKey = "github_projects_{$this->username}";
            
            // Try to get from cache first (cache for 10 minutes)
            $repositories = Cache::remember($cacheKey, 600, function () {
                return $this->fetchRepositoriesFromGitHub();
            });

            if ($repositories === null) {
                return [
                    'success' => false,
                    'message' => 'Không thể lấy dữ liệu từ GitHub API',
                    'data' => []
                ];
            }
            
            // Convert repositories to project format
            $projects = array_map(function ($repo) {
                return $this->mapRepositoryToProject($repo);
            }, $repositories);

            // Apply filters
            $projects = $this->applyFilters($projects, $filters);

            // Sort projects
            $projects = $this->sortProjects($projects, $filters);

            return [
                'success' => true,
                'data' => $projects,
                'total' => count($projects)
            ];

        } catch (\Exception $e) {
            Log::error('GitHub Project Service Error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu projects từ GitHub',
                'data' => []
            ];
        }
    }

    /**
     * Get a specific project by repository name
     */
    public function getProject(string $repoName)
    {
        try {
            // Validate token and username
            if (!$this->token || !$this->username) {
                return [
                    'success' => false,
                    'message' => 'GitHub token hoặc username chưa được cấu hình',
                    'data' => null
                ];
            }

            $cacheKey = "github_project_{$this->username}_{$repoName}";
            
            $repository = Cache::remember($cacheKey, 300, function () use ($repoName) {
                return $this->fetchRepositoryFromGitHub($repoName);
            });

            if ($repository === null) {
                return [
                    'success' => false,
                    'message' => 'Repository không tồn tại hoặc không thể truy cập',
                    'data' => null
                ];
            }

            $project = $this->mapRepositoryToProject($repository);

            return [
                'success' => true,
                'data' => $project
            ];

        } catch (\Exception $e) {
            Log::error('GitHub Project Service Error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin project từ GitHub',
                'data' => null
            ];
        }
    }

    /**
     * Get featured projects (projects with most stars or specific topics)
     */
    public function getFeaturedProjects(int $limit = 6)
    {
        $result = $this->getAllProjects();
        
        if (!$result['success']) {
            return $result;
        }

        $projects = $result['data'];

        // Filter projects that have technologies and meet featured criteria
        $featuredProjects = collect($projects)
            ->filter(function ($project) {
                // Only include projects that have technologies
                return !empty($project['technologies']) && 
                       ($project['stargazers_count'] > 0 || 
                        in_array('featured', $project['topics']) ||
                        in_array('portfolio', $project['topics']) ||
                        !$project['fork']); // Include non-forked repositories
            })
            ->sortByDesc(function ($project) {
                // Sort by stars first, then by update date
                return $project['stargazers_count'] * 1000 + strtotime($project['updated_at']);
            })
            ->take($limit)
            ->values()
            ->toArray();

        // If still no projects, return the most recent ones that have technologies
        if (empty($featuredProjects)) {
            $featuredProjects = collect($projects)
                ->filter(function ($project) {
                    // Only include projects that have technologies
                    return !empty($project['technologies']);
                })
                ->sortByDesc('updated_at')
                ->take($limit)
                ->values()
                ->toArray();
        }

        return [
            'success' => true,
            'data' => $featuredProjects
        ];
    }

    /**
     * Get all technologies used in projects
     */
    public function getTechnologies()
    {
        $result = $this->getAllProjects();
        
        if (!$result['success']) {
            return $result;
        }

        $projects = $result['data'];
        
        $technologies = collect($projects)
            ->pluck('technologies')
            ->flatten()
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        return [
            'success' => true,
            'data' => $technologies
        ];
    }

    /**
     * Map GitHub repository to project format
     */
    private function mapRepositoryToProject(array $repo): array
    {
        // Extract technologies from language and topics
        $technologies = [];
        
        if ($repo['language']) {
            $technologies[] = $repo['language'];
        }
        
        if (!empty($repo['topics'])) {
            $technologies = array_merge($technologies, $repo['topics']);
        }

        // Create description from repository description or generate one
        $description = $repo['description'] ?: "Repository: {$repo['name']}";
        
        // Generate demo URL if it exists (check for GitHub Pages, Vercel, etc.)
        $demoUrl = $this->extractDemoUrl($repo);

        return [
            'id' => $repo['id'],
            'title' => $this->formatTitle($repo['name']),
            'slug' => Str::slug($repo['name']),
            'description' => $description,
            'content' => $this->generateContent($repo),
            'technologies' => array_unique($technologies),
            'status' => 'active',
            'github_url' => $repo['html_url'],
            'demo_url' => $demoUrl,
            'figma_url' => null,
            'featured' => $repo['stargazers_count'] > 0 || in_array('featured', $repo['topics'] ?? []),
            'sort_order' => 0,
            'meta_description' => Str::limit($description, 160),
            'published_at' => $repo['created_at'],
            'created_at' => $repo['created_at'],
            'updated_at' => $repo['updated_at'],
            'pushed_at' => $repo['pushed_at'],
            'stargazers_count' => $repo['stargazers_count'],
            'forks_count' => $repo['forks_count'],
            'open_issues_count' => $repo['open_issues_count'],
            'private' => $repo['private'],
            'fork' => $repo['fork'],
            'topics' => $repo['topics'] ?? [],
            'default_branch' => $repo['default_branch'],
            'size' => $repo['size'] ?? 0,
            'language' => $repo['language']
        ];
    }

    /**
     * Format repository name to readable title
     */
    private function formatTitle(string $name): string
    {
        // Convert kebab-case and snake_case to Title Case
        return Str::title(str_replace(['-', '_'], ' ', $name));
    }

    /**
     * Generate content for project
     */
    private function generateContent(array $repo): string
    {
        $content = [];
        
        if ($repo['description']) {
            $content[] = $repo['description'];
        }
        
        if ($repo['language']) {
            $content[] = "**Ngôn ngữ chính:** {$repo['language']}";
        }
        
        if (!empty($repo['topics'])) {
            $content[] = "**Tags:** " . implode(', ', $repo['topics']);
        }
        
        $content[] = "**Repository:** [{$repo['full_name']}]({$repo['html_url']})";
        
        if ($repo['stargazers_count'] > 0) {
            $content[] = "⭐ {$repo['stargazers_count']} stars";
        }
        
        if ($repo['forks_count'] > 0) {
            $content[] = "🍴 {$repo['forks_count']} forks";
        }

        return implode("\n\n", $content);
    }

    /**
     * Extract demo URL from repository
     */
    private function extractDemoUrl(array $repo): ?string
    {
        // Check for GitHub Pages
        if (strpos($repo['name'], '.github.io') !== false) {
            return "https://{$repo['owner']['login']}.github.io/{$repo['name']}";
        }

        // Check topics for deployment platforms
        $topics = $repo['topics'] ?? [];
        foreach ($topics as $topic) {
            if (strpos($topic, 'vercel') !== false || strpos($topic, 'netlify') !== false) {
                // Could potentially parse homepage URL if available
                return null; // Would need homepage field from repo
            }
        }

        return null;
    }

    /**
     * Apply filters to projects
     */
    private function applyFilters(array $projects, array $filters): array
    {
        $filtered = collect($projects);

        // Filter by featured
        if (isset($filters['featured']) && $filters['featured']) {
            $filtered = $filtered->where('featured', true);
        }

        // Filter by technology
        if (isset($filters['technology']) && $filters['technology']) {
            $filtered = $filtered->filter(function ($project) use ($filters) {
                return in_array($filters['technology'], $project['technologies']);
            });
        }

        // Filter projects that have technologies (always apply this filter)
        $filtered = $filtered->filter(function ($project) {
            return !empty($project['technologies']);
        });

        // Search
        if (isset($filters['search']) && $filters['search']) {
            $searchTerm = strtolower($filters['search']);
            $filtered = $filtered->filter(function ($project) use ($searchTerm) {
                return strpos(strtolower($project['title']), $searchTerm) !== false ||
                       strpos(strtolower($project['description']), $searchTerm) !== false;
            });
        }

        return $filtered->values()->toArray();
    }

    /**
     * Sort projects
     */
    private function sortProjects(array $projects, array $filters): array
    {
        $sortBy = $filters['sort'] ?? 'updated_at';
        $sortDirection = $filters['direction'] ?? 'desc';

        $sorted = collect($projects);

        switch ($sortBy) {
            case 'stargazers_count':
                $sorted = $sortDirection === 'desc' 
                    ? $sorted->sortByDesc('stargazers_count')
                    : $sorted->sortBy('stargazers_count');
                break;
            case 'created_at':
                $sorted = $sortDirection === 'desc'
                    ? $sorted->sortByDesc('created_at')
                    : $sorted->sortBy('created_at');
                break;
            case 'updated_at':
            default:
                $sorted = $sortDirection === 'desc'
                    ? $sorted->sortByDesc('updated_at')
                    : $sorted->sortBy('updated_at');
                break;
        }

        return $sorted->values()->toArray();
    }

    /**
     * Fetch repositories from GitHub API
     */
    private function fetchRepositoriesFromGitHub()
    {
        try {
            $response = $this->client->get("https://api.github.com/users/{$this->username}/repos", [
                'headers' => [
                    'Authorization' => "Bearer {$this->token}",
                    'Accept' => 'application/vnd.github.v3+json',
                    'User-Agent' => 'Laravel-Portfolio-App'
                ],
                'query' => [
                    'type' => 'owner',
                    'sort' => 'updated',
                    'direction' => 'desc',
                    'per_page' => 100
                ]
            ]);

            $repositories = json_decode($response->getBody()->getContents(), true);
            return $repositories;

        } catch (RequestException $e) {
            Log::error('GitHub API Request Error: ' . $e->getMessage());
            if ($e->hasResponse()) {
                $response = $e->getResponse();
                Log::error('GitHub API Response: ' . $response->getBody()->getContents());
            }
            return null;
        }
    }

    /**
     * Fetch a specific repository from GitHub API
     */
    private function fetchRepositoryFromGitHub(string $repoName)
    {
        try {
            $response = $this->client->get("https://api.github.com/repos/{$this->username}/{$repoName}", [
                'headers' => [
                    'Authorization' => "Bearer {$this->token}",
                    'Accept' => 'application/vnd.github.v3+json',
                    'User-Agent' => 'Laravel-Portfolio-App'
                ]
            ]);

            $repo = json_decode($response->getBody()->getContents(), true);
            return $repo;

        } catch (RequestException $e) {
            Log::error('GitHub API Request Error: ' . $e->getMessage());
            return null;
        }
    }
}