import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });
  const { id } = useParams(); // Get ID from route
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Load patient data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:8000/api/patients/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData(data);
          setLoading(false);
        })
        .catch(() => {
          alert('Failed to load patient data');
          setLoading(false);
        });
    }
  }, [id]);

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = id
      ? `http://localhost:8000/api/patients/${id}`
      : 'http://localhost:8000/api/patients';
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Request failed');
      navigate('/'); // Redirect after save
    } catch {
      alert('Error saving patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <div className="card shadow-sm">
        {/* Card Header */}
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h4 className="mb-0">{id ? 'Edit' : 'Create'} Patient</h4>
          <button
            className="btn btn-light btn-sm rounded-circle fw-bold"
            onClick={() => navigate('/')}
            aria-label="Close form"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        {/* Card Body - Patient Form */}
        <div className="card-body">
          {loading && !id ? (
            <div className="text-center text-muted my-4">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* First Name */}
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label fw-semibold">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="form-control form-control-lg"
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  placeholder="Enter first name"
                  disabled={loading}
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label htmlFor="lastName" className="form-label fw-semibold">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="form-control form-control-lg"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  placeholder="Enter last name"
                  disabled={loading}
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary btn-lg px-4" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    `${id ? 'Update' : 'Create'} Patient`
                  )}
                </button>
                <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={() => navigate('/')} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
