import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // Fetch patients from the API when component loads
  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to fetch patient data
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      alert('Error loading patients. Please try again.');
      console.error(error);
    }
  };

  // Function to delete a patient
  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete patient');
      fetchPatients(); // Refresh list after deletion
    } catch (error) {
      alert('Error deleting patient. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Header and Add Patient Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-5 text-primary fw-bold">Mapatay Clinic Patient List</h2>
        <Link to="/patients/new" className="btn btn-success shadow-sm">
          <i className="bi bi-plus-lg me-2"></i> Add New Patient
        </Link>
      </div>
      
      {/* Patient List Table */}
      {patients.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          No patients found. Start by adding a new patient!
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark text-uppercase small">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className="align-middle">
                  <td>{patient.id}</td>
                  <td className="text-capitalize">{patient.first_name}</td>
                  <td className="text-capitalize">{patient.last_name}</td>
                  <td className="text-center">
                    {/* Action buttons */}
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => navigate(`/patients/${patient.id}/edit`)}
                      title="Edit Patient"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => deletePatient(patient.id)}
                      title="Delete Patient"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/patients/${patient.id}/records`)}
                      title="View Medical Records"
                    >
                      <i className="bi bi-file-medical"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
