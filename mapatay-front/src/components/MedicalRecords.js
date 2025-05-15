import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    visit_date: '',
    diagnosis: '',
    prescription: '',
  });
  const [editingId, setEditingId] = useState(null);
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch patient's records and info
  useEffect(() => {
    fetchRecords();
    fetchPatient();
  }, [patientId]);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/patients/${patientId}/records`);
      const data = await res.json();
      setRecords(data);
    } catch {
      alert('Failed to load medical records.');
    }
  };

  const fetchPatient = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/patients/${patientId}`);
      const data = await res.json();
      setPatient(data);
    } catch {
      alert('Failed to load patient data.');
    }
  };

  // Handle form submission for add/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.visit_date) {
      alert('Please set the visit date before submitting the medical record.');
      return;
    }

    setLoading(true);
    const url = editingId
      ? `http://localhost:8000/api/records/${editingId}`
      : 'http://localhost:8000/api/records';

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patient_id: patientId,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setFormData({ visit_date: '', diagnosis: '', prescription: '' });
      setEditingId(null);
      fetchRecords(); // Refresh records after save
    } catch {
      alert('Failed to save medical record.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;
    try {
      await fetch(`http://localhost:8000/api/records/${id}`, { method: 'DELETE' });
      setRecords(records.filter(record => record.id !== id));
    } catch {
      alert('Failed to delete record.');
    }
  };

  // Edit record
  const startEditing = (record) => {
    setFormData({
      visit_date: new Date(record.visit_date).toISOString().slice(0, 10),
      diagnosis: record.diagnosis,
      prescription: record.prescription,
    });
    setEditingId(record.id);
  };

  const cancelEdit = () => {
    setFormData({ visit_date: '', diagnosis: '', prescription: '' });
    setEditingId(null);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 700 }}>
      {/* Back Button */}
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back to Patients
      </button>

      {/* Display patient info */}
      {patient && (
        <div className="card shadow-sm mb-4 border-primary">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Patient Information</h5>
          </div>
          <div className="card-body">
            <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
            <p><strong>Patient ID:</strong> {patient.id}</p>
          </div>
        </div>
      )}

      {/* Form to add/edit medical record */}
      <div className="card shadow-sm mb-4">
        <div className={`card-header ${editingId ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
          <h4 className="mb-0">{editingId ? 'Edit Medical Record' : 'Add New Medical Record'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* Visit Date */}
            <div className="mb-3">
              <label htmlFor="visitDate" className="form-label fw-semibold">Visit Date</label>
              <input
                id="visitDate"
                type="date"
                className="form-control"
                value={formData.visit_date}
                onChange={e => setFormData({ ...formData, visit_date: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            {/* Diagnosis */}
            <div className="mb-3">
              <label htmlFor="diagnosis" className="form-label fw-semibold">Diagnosis</label>
              <textarea
                id="diagnosis"
                className="form-control"
                rows={3}
                value={formData.diagnosis}
                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                required
                disabled={loading}
              ></textarea>
            </div>
            {/* Prescription */}
            <div className="mb-3">
              <label htmlFor="prescription" className="form-label fw-semibold">Prescription</label>
              <textarea
                id="prescription"
                className="form-control"
                rows={3}
                value={formData.prescription}
                onChange={e => setFormData({ ...formData, prescription: e.target.value })}
                required
                disabled={loading}
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between">
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'} px-4`} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  editingId ? 'Update Record' : 'Add Record'
                )}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary px-4" onClick={cancelEdit} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Medical Records List */}
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">Medical Records</h4>
        </div>
        <div className="card-body">
          {records.length === 0 ? (
            <p className="text-muted fst-italic">No medical records found.</p>
          ) : (
            records.map(record => (
              <div key={record.id} className="mb-3 p-3 border rounded border-secondary bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">{formatDateForDisplay(record.visit_date)}</h5>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEditing(record)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRecord(record.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <p><strong>Diagnosis:</strong></p>
                <p>{record.diagnosis}</p>
                <p><strong>Prescription:</strong></p>
                <p>{record.prescription}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
