<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\MedicalRecordController;

// Simple test route to verify API is working
Route::get('/ping', fn () => response()->json(['message' => 'It works!']));

// RESTful API routes for patient operations (index, store, show, update, destroy)
Route::apiResource('patients', PatientController::class);

// RESTful API routes for medical record operations
Route::apiResource('records', MedicalRecordController::class);

// Custom route to fetch all records for a specific patient
Route::get('patients/{id}/records', [MedicalRecordController::class, 'getRecordsByPatient']);
