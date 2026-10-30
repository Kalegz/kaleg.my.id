<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    /**
     * Get all skills grouped by category (public)
     */
    public function index(): JsonResponse
    {
        $skills = Skill::orderBy('category')->orderBy('sort_order')->get();
        $grouped = $skills->groupBy('category');

        return response()->json($grouped);
    }

    /**
     * Create a new skill (admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'level' => 'sometimes|integer|min:0|max:100',
            'sort_order' => 'sometimes|integer',
            'is_featured' => 'sometimes|boolean',
        ]);

        $skill = Skill::create($validated);

        return response()->json($skill, 201);
    }

    /**
     * Update a skill (admin)
     */
    public function update(Request $request, Skill $skill): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'level' => 'sometimes|integer|min:0|max:100',
            'sort_order' => 'sometimes|integer',
            'is_featured' => 'sometimes|boolean',
        ]);

        $skill->update($validated);

        return response()->json($skill);
    }

    /**
     * Delete a skill (admin)
     */
    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();

        return response()->json(['message' => 'Skill deleted']);
    }
}
