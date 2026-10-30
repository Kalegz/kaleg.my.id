<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    /**
     * Get all experiences sorted by date (public)
     */
    public function index(): JsonResponse
    {
        $experiences = Experience::orderByDesc('start_date')->get();

        return response()->json($experiences);
    }

    /**
     * Create a new experience (admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        $experience = Experience::create($validated);

        return response()->json($experience, 201);
    }

    /**
     * Update an experience (admin)
     */
    public function update(Request $request, Experience $experience): JsonResponse
    {
        $validated = $request->validate([
            'company' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'is_current' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        $experience->update($validated);

        return response()->json($experience);
    }

    /**
     * Delete an experience (admin)
     */
    public function destroy(Experience $experience): JsonResponse
    {
        $experience->delete();

        return response()->json(['message' => 'Experience deleted']);
    }
}
