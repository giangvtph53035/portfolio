<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GitHubController extends Controller
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

    public function getRepos(Request $request): JsonResponse
    {
        try {
            // Validate token and username
            if (!$this->token || !$this->username) {
                return response()->json([
                    'success' => false,
                    'message' => 'GitHub token hoặc username chưa được cấu hình'
                ], 422);
            }

            // Cache key
            $cacheKey = "github_repos_{$this->username}";
            
            // Try to get from cache first (cache for 10 minutes)
            $repositories = Cache::remember($cacheKey, 600, function () {
                return $this->fetchRepositoriesFromGitHub();
            });

            if ($repositories === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể lấy dữ liệu từ GitHub API'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $repositories,
                'total' => count($repositories)
            ]);

        } catch (\Exception $e) {
            Log::error('GitHub API Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu từ GitHub',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
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

            // Format the data to return only necessary information
            return array_map(function ($repo) {
                return [
                    'id' => $repo['id'],
                    'name' => $repo['name'],
                    'full_name' => $repo['full_name'],
                    'description' => $repo['description'],
                    'html_url' => $repo['html_url'],
                    'clone_url' => $repo['clone_url'],
                    'language' => $repo['language'],
                    'stargazers_count' => $repo['stargazers_count'],
                    'forks_count' => $repo['forks_count'],
                    'open_issues_count' => $repo['open_issues_count'],
                    'created_at' => $repo['created_at'],
                    'updated_at' => $repo['updated_at'],
                    'pushed_at' => $repo['pushed_at'],
                    'private' => $repo['private'],
                    'fork' => $repo['fork'],
                    'topics' => $repo['topics'] ?? [],
                    'default_branch' => $repo['default_branch']
                ];
            }, $repositories);

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
     * Get a specific repository
     */
    public function getRepo(string $repoName): JsonResponse
    {
        try {
            if (!$this->token || !$this->username) {
                return response()->json([
                    'success' => false,
                    'message' => 'GitHub token hoặc username chưa được cấu hình'
                ], 422);
            }

            $cacheKey = "github_repo_{$this->username}_{$repoName}";
            
            $repository = Cache::remember($cacheKey, 300, function () use ($repoName) {
                return $this->fetchRepositoryFromGitHub($repoName);
            });

            if ($repository === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Repository không tồn tại hoặc không thể truy cập'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $repository
            ]);

        } catch (\Exception $e) {
            Log::error('GitHub API Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin repository',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
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

            return [
                'id' => $repo['id'],
                'name' => $repo['name'],
                'full_name' => $repo['full_name'],
                'description' => $repo['description'],
                'html_url' => $repo['html_url'],
                'clone_url' => $repo['clone_url'],
                'language' => $repo['language'],
                'stargazers_count' => $repo['stargazers_count'],
                'forks_count' => $repo['forks_count'],
                'open_issues_count' => $repo['open_issues_count'],
                'created_at' => $repo['created_at'],
                'updated_at' => $repo['updated_at'],
                'pushed_at' => $repo['pushed_at'],
                'private' => $repo['private'],
                'fork' => $repo['fork'],
                'topics' => $repo['topics'] ?? [],
                'default_branch' => $repo['default_branch'],
                'size' => $repo['size'],
                'license' => $repo['license']
            ];

        } catch (RequestException $e) {
            Log::error('GitHub API Request Error: ' . $e->getMessage());
            return null;
        }
    }
}
