<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Get the portfolio profile (public)
     */
    public function show(): JsonResponse
    {
        $profile = Profile::first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Update profile (admin)
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'title' => 'sometimes|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'bio' => 'sometimes|string',
            'email' => 'sometimes|email|max:255',
            'location' => 'nullable|string|max:255',
            'avatar_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'resume_url' => 'nullable|url',
            'is_available' => 'sometimes|boolean',
        ]);

        $profile = Profile::firstOrCreate([]);
        $profile->update($validated);

        return response()->json($profile);
    }
}
