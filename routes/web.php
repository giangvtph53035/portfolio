<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Trang chủ hiển thị 4 repositories nổi bật
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

// Trang projects đầy đủ
Route::get('/projects', function () {
    return Inertia::render('projects');
})->name('projects');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';