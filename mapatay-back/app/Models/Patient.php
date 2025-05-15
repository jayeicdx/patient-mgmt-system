<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = ['first_name', 'last_name']; 

    // Relationship to Medical Record
    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }
}
