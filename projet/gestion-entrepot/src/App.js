import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InscriptionPage from './pages/Inscription';
import DashboardPage from './pages/Dashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* d'autres routes ici */}
      </Routes>


    </Router>
  );
}

export default App;
