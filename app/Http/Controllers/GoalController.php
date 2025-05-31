<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
class GoalController extends Controller
{
    public function index()
    {
        $goals = auth()->user()->goals()->get();
        return response()->json($goals);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'nullable|date',
            'tasks' => 'nullable|array',
        ]);

        $goal = auth()->user()->goals()->create($validated);
        return response()->json($goal, 201);
    }

    public function show($id)
    {
        $goal = auth()->user()->goals()->findOrFail($id);
        return response()->json($goal);
    }

    public function update(Request $request, $id)
    {
        $goal = auth()->user()->goals()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'nullable|date',
            'tasks' => 'nullable|array',
        ]);

        $goal->update($validated);
        return response()->json($goal);
    }

    public function destroy($id)
    {
        $goal = auth()->user()->goals()->findOrFail($id);
        $goal->delete();

        return response()->json(['message' => 'Goal deleted']);
    }
}

