<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
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
            'cover_image' => 'nullable',
            'cover_image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable',
            'status' => 'sometimes|in:draft,published',
            'read_time' => 'sometimes|integer|min:1',
            'published_at' => 'nullable|date',
        ]);

        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $decoded = json_decode($validated['tags'], true);
            $validated['tags'] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : array_map('trim', explode(',', $validated['tags']));
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $validated['cover_image'] = asset('storage/' . $path);
        } elseif ($request->hasFile('cover_image_file')) {
            $path = $request->file('cover_image_file')->store('posts', 'public');
            $validated['cover_image'] = asset('storage/' . $path);
        }
        unset($validated['cover_image_file']);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['status']) && $validated['status'] === 'published' && empty($validated['published_at'])) {
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
            'cover_image' => 'nullable',
            'cover_image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable',
            'status' => 'sometimes|in:draft,published',
            'read_time' => 'sometimes|integer|min:1',
            'published_at' => 'nullable|date',
        ]);

        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $decoded = json_decode($validated['tags'], true);
            $validated['tags'] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : array_map('trim', explode(',', $validated['tags']));
        }

        if ($request->hasFile('cover_image') || $request->hasFile('cover_image_file')) {
            $uploadedFile = $request->file('cover_image') ?? $request->file('cover_image_file');
            if ($post->cover_image) {
                $oldPath = str_replace(rtrim(config('app.url'), '/') . '/storage/', '', $post->cover_image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $uploadedFile->store('posts', 'public');
            $validated['cover_image'] = asset('storage/' . $path);
        }
        unset($validated['cover_image_file']);

        if (isset($validated['status']) && $validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return response()->json($post);
    }

    /**
     * Upload cover image for posts (admin)
     */
    public function uploadCover(Request $request): JsonResponse
    {
        $request->validate([
            'cover_image' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
        ]);

        $path = $request->file('cover_image')->store('posts', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'cover_image' => $url,
            'url' => $url,
        ]);
    }

    /**
     * Delete a post (admin)
     */
    public function destroy(Post $post): JsonResponse
    {
        if ($post->cover_image) {
            $oldPath = str_replace(rtrim(config('app.url'), '/') . '/storage/', '', $post->cover_image);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }

    /**
     * Get all posts including drafts (admin)
     */
    public function adminIndex(): JsonResponse
    {
        $posts = Post::orderByDesc('created_at')->get();

        return response()->json($posts);
    }

    /**
     * Get a single post by ID including drafts and all fields (admin)
     */
    public function showAdmin(Post $post): JsonResponse
    {
        return response()->json($post);
    }
}
