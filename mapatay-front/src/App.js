import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import MedicalRecords from './components/MedicalRecords';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/:id/edit" element={<PatientForm />} />
        <Route path="/patients/:patientId/records" element={<MedicalRecords
        />} />
      </Routes>
    </Router>
  );

}
export default App;