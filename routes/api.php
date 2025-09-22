<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\GitHubController;
use App\Http\Controllers\LocaleController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API routes for portfolio
Route::prefix('v1')->group(function () {
    // Localization
    Route::post('/locale', [LocaleController::class, 'setLocale']);
    Route::get('/translations', [LocaleController::class, 'getTranslations']);
    
    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/featured', [ProjectController::class, 'featured']);
    Route::get('/projects/technologies', [ProjectController::class, 'technologies']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);
    
    // GitHub
    Route::get('/github/repos', [GitHubController::class, 'getRepos']);
    Route::get('/github/repos/{repoName}', [GitHubController::class, 'getRepo']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    });


});
