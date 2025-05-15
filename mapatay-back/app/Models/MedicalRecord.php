<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    protected $fillable = ['patient_id', 'visit_date', 'diagnosis', 'prescription'];

    // Relationship to Patient
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
