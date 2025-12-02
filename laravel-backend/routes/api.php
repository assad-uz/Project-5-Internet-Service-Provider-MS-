<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController; // আপনার কন্ট্রোলার অনুযায়ী নাম দিন

// ✅ ১. CSRF কুকি রুট (SPA Auth এর জন্য আবশ্যক)
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->noContent();
})->middleware('web');

// ✅ ২. Auth রুট (Breeze এ তৈরি হয়)
require __DIR__.'/auth.php'; 

// ✅ ৩. কাস্টমার CRUD রুট
Route::resource('customers', CustomerController::class);

// ... অন্য রুট ...
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});