<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Get all published posts (public)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::published()->orderByDesc('published_at');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        $posts = $query->paginate(10);

        // Remove full content from list view
        $posts->getCollection()->transform(function ($post) {
            unset($post->content);
            return $post;
        });

        return response()->json($posts);
    }

    /**
     * Get a single published post by slug (public)
     */
    public function show(string $slug): JsonResponse
    {
        $post = Post::published()->where('slug', $slug)->firstOrFail();

        // Increment view count
        $post->increment('views');

        return response()->json($post);
    }

    /**
     * Create a new post (admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:posts|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'cover_image' => 'nullable|url',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'sometimes|in:draft,published',
            'read_time' => 'sometimes|integer|min:1',
            'published_at' => 'nullable|date',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    /**
     * Update a post (admin)
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|unique:posts,slug,' . $post->id . '|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|string',
            'cover_image' => 'nullable|url',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'sometimes|in:draft,published',
            'read_time' => 'sometimes|integer|min:1',
            'published_at' => 'nullable|date',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return response()->json($post);
    }

    /**
     * Delete a post (admin)
     */
    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }

    /**
     * Get all posts including drafts (admin)
     */
    public function adminIndex(): JsonResponse
    {
        $posts = Post::orderByDesc('created_at')->get(['id', 'title', 'slug', 'category', 'status', 'views', 'published_at', 'created_at']);

        return response()->json($posts);
    }
}
