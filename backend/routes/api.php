<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ParcelController;
use App\Http\Controllers\ShipmentController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Company routes
    Route::get('/company', [CompanyController::class, 'show']);
    Route::post('/company/users', [CompanyController::class, 'addUser']);
    Route::get('/company/users', [CompanyController::class, 'getUsers']);

    // Warehouse routes
    Route::get('/warehouses', [WarehouseController::class, 'index']);
    Route::post('/warehouses', [WarehouseController::class, 'store']);
    Route::get('/warehouses/{id}', [WarehouseController::class, 'show']);
    Route::put('/warehouses/{id}', [WarehouseController::class, 'update']);
    Route::delete('/warehouses/{id}', [WarehouseController::class, 'destroy']);

    // Vehicle routes
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
    Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

    // Parcel routes
    Route::get('/parcels', [ParcelController::class, 'index']);
    Route::post('/parcels', [ParcelController::class, 'store']);
    Route::get('/parcels/{id}', [ParcelController::class, 'show']);
    Route::post('/parcels/{id}/accept', [ParcelController::class, 'accept']);
    Route::post('/parcels/{id}/reject', [ParcelController::class, 'reject']);

    // Shipment routes
    Route::get('/shipments', [ShipmentController::class, 'index']);
    Route::post('/shipments', [ShipmentController::class, 'store']);
    Route::get('/shipments/{id}', [ShipmentController::class, 'show']);
    Route::patch('/shipments/{id}/status', [ShipmentController::class, 'updateStatus']);
});
