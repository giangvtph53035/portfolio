<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->active()->published()->with('tags', 'media');

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by technology
        if ($request->has('technology')) {
            $technology = $request->get('technology');
            $query->whereJsonContains('technologies', $technology);
        }

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->get('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'sort_order');
        $sortDirection = $request->get('direction', 'asc');
        
        if ($sortBy === 'sort_order') {
            $query->ordered();
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $projects = $query->paginate($perPage);

        return response()->json([
            'data' => $projects->items(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug): JsonResponse
    {
        $project = Project::where('slug', $slug)
            ->active()
            ->published()
            ->with('tags', 'media')
            ->firstOrFail();

        return response()->json([
            'data' => $project
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
        $projects = Project::active()
            ->published()
            ->featured()
            ->ordered()
            ->with('tags', 'media')
            ->limit(6)
            ->get();

        return response()->json([
            'data' => $projects
        ]);
    }

    /**
     * Get all technologies used in projects
     */
    public function technologies(): JsonResponse
    {
        $technologies = Project::active()
            ->published()
            ->whereNotNull('technologies')
            ->pluck('technologies')
            ->flatten()
            ->unique()
            ->values();

        return response()->json([
            'data' => $technologies
        ]);
    }
}
