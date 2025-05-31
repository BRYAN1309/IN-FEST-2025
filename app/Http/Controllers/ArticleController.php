<?php

namespace App\Http\Controllers;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
  public function index()
    {
        return Article::all();
    }

    public function show($id)
    {
        return Article::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'author' => 'required|string',
            'desc' => 'required|string',
            'publish_year' => 'required|digits:4|integer',
            'title' => 'required|string',
            'url_article' => 'required|url',
            'url_image' => 'required|url'
        ]);

        return Article::create($validated);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'author' => 'sometimes|required|string',
            'desc' => 'sometimes|required|string',
            'publish_year' => 'sometimes|required|digits:4|integer',
            'title' => 'sometimes|required|string',
            'url_article' => 'sometimes|required|url',
            'url_image' => 'sometimes|required|url'
        ]);

        $article->update($validated);
        return $article;
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        return response()->json(['message' => 'Article deleted']);
    }
}
