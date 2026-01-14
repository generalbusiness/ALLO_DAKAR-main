<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookingController;

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'OK']);
});

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::put('/users/profile', [UserController::class, 'update']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    // Wallet
    Route::get('/wallet/balance', [\App\Http\Controllers\WalletController::class, 'balance']);
    Route::post('/wallet/set-pin', [\App\Http\Controllers\WalletController::class, 'setPin']);
    Route::post('/wallet/verify-pin', [\App\Http\Controllers\WalletController::class, 'verifyPin']);
    Route::post('/wallet/deposit', [\App\Http\Controllers\WalletController::class, 'deposit']);
    Route::get('/wallet/transactions', [\App\Http\Controllers\WalletController::class, 'transactions']);
});
