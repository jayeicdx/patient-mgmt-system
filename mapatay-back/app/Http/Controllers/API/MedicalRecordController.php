<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    // GET /api/records
    public function index()
    {
        return response()->json(MedicalRecord::with('patient')->get());
    }

    // POST /api/records (CREATE)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id'  => 'required|exists:patients,id',
            'visit_date'  => 'required|date',
            'diagnosis'   => 'required|string',
            'prescription'=> 'required|string',
        ]);

        $record = MedicalRecord::create($validated);

        return response()->json($record, 201);
    }

    // GET /api/records/{id} (SHOW)
    public function show($id)
    {
        $record = MedicalRecord::with('patient')->findOrFail($id);

        return response()->json($record);
    }

    // PUT/PATCH /api/records/{id} (UPDATE)
    public function update(Request $request, $id)
    {
        $record = MedicalRecord::findOrFail($id);

        $validated = $request->validate([
            'visit_date'   => 'sometimes|required|date',
            'diagnosis'    => 'sometimes|required|string',
            'prescription' => 'sometimes|required|string',
        ]);

        $record->update($validated);

        return response()->json($record);
    }

    // DELETE /api/records/{id}
    public function destroy($id)
    {
        $record = MedicalRecord::findOrFail($id);
        $record->delete();

        return response()->json(['message' => 'Medical record deleted successfully']);
    }

    // GET /api/patients/{id}/records
    public function getRecordsByPatient($id)
    {
        $patient = Patient::findOrFail($id);
        $records = $patient->medicalRecords;

        return response()->json($records);
    }
}
