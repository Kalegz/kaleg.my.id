<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

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
            'name'          => 'sometimes|string|max:255',
            'title'         => 'sometimes|string|max:255',
            'tagline'       => 'nullable|string|max:255',
            'bio'           => 'sometimes|string',
            'email'         => 'sometimes|email|max:255',
            'location'      => 'nullable|string|max:255',
            'avatar_url'    => 'nullable|url',
            'github_url'    => 'nullable|url',
            'linkedin_url'  => 'nullable|url',
            'twitter_url'   => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'resume_url'    => 'nullable|url',
            'is_available'  => 'sometimes|boolean',
        ]);

        $profile = Profile::firstOrCreate([]);
        $profile->update($validated);

        return response()->json($profile);
    }

    /**
     * Upload avatar image (admin)
     * Accepts: multipart/form-data with field "avatar"
     * Returns: { avatar_url: "https://..." }
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $profile = Profile::firstOrCreate([]);

        // Delete old avatar file if it was a locally stored one
        if ($profile->avatar_url) {
            $oldPath = str_replace(
                rtrim(config('app.url'), '/') . '/storage/',
                '',
                $profile->avatar_url
            );
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $url  = asset('storage/' . $path);

        $profile->update(['avatar_url' => $url]);

        return response()->json(['avatar_url' => $url]);
    }
}
