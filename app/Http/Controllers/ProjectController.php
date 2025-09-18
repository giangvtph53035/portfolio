<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\GitHubProjectService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    private $githubProjectService;

    public function __construct(GitHubProjectService $githubProjectService)
    {
        $this->githubProjectService = $githubProjectService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        // Get filters from request
        $filters = [
            'featured' => $request->boolean('featured'),
            'technology' => $request->get('technology'),
            'search' => $request->get('search'),
            'sort' => $request->get('sort', 'updated_at'),
            'direction' => $request->get('direction', 'desc'),
        ];

        // Get projects from GitHub
        $result = $this->githubProjectService->getAllProjects($filters);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 0,
                    'total' => 0,
                ]
            ], 500);
        }

        $projects = $result['data'];

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $page = $request->get('page', 1);
        $total = count($projects);
        $lastPage = ceil($total / $perPage);
        
        $paginatedProjects = array_slice($projects, ($page - 1) * $perPage, $perPage);

        return response()->json([
            'success' => true,
            'data' => $paginatedProjects,
            'meta' => [
                'current_page' => (int) $page,
                'last_page' => $lastPage,
                'per_page' => (int) $perPage,
                'total' => $total,
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug): JsonResponse
    {
        // Get project from GitHub by repository name (slug)
        $result = $this->githubProjectService->getProject($slug);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'technologies' => 'nullable|array',
            'status' => 'in:draft,active,inactive',
            'github_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'figma_url' => 'nullable|url',
            'featured' => 'boolean',
            'sort_order' => 'integer',
            'meta_description' => 'nullable|string|max:160',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $project = Project::create($validated);

        if ($request->has('tags')) {
            $project->attachTags($request->tags);
        }

        return response()->json([
            'data' => $project->load('tags'),
            'message' => 'Project created successfully'
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'content' => 'nullable|string',
            'technologies' => 'nullable|array',
            'status' => 'in:draft,active,inactive',
            'github_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'figma_url' => 'nullable|url',
            'featured' => 'boolean',
            'sort_order' => 'integer',
            'meta_description' => 'nullable|string|max:160',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|array',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project->update($validated);

        if ($request->has('tags')) {
            $project->syncTags($request->tags);
        }

        return response()->json([
            'data' => $project->load('tags'),
            'message' => 'Project updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }

    /**
     * Get featured projects
     */
    public function featured(): JsonResponse
    {
        $result = $this->githubProjectService->getFeaturedProjects(6);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'data' => []
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data']
        ]);
    }

    /**
     * Get all technologies used in projects
     */
    public function technologies(): JsonResponse
    {
        $result = $this->githubProjectService->getTechnologies();

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'data' => []
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data']
        ]);
    }
}
