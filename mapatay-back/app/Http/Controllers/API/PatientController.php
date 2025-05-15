<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // GET /api/patients
    public function index()
    {
        return response()->json(Patient::all());
    }

    // POST /api/patients (CREATE)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
        ]);

        $patient = Patient::create($validated);

        return response()->json($patient, 201);
    }

    // GET /api/patients/{id} (READ)
    public function show($id)
    {
        $patient = Patient::findOrFail($id);

        return response()->json($patient);
    }

    // PUT/PATCH /api/patients/{id} (UPDATE)
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'  => 'sometimes|required|string|max:255',
        ]);

        $patient->update($validated);

        return response()->json($patient);
    }

    // DELETE /api/patients/{id}
    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
