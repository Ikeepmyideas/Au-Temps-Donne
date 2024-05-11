import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import DashboardPage from './pages/Dashboard'; 
import Donrees from './pages/denrees'
import Entrepots from './pages/entrepots'

import WebFont from 'webfontloader'; 
import ProtectedRoute from './pages/hooks/authToken';

// Initialize WebFont
WebFont.load({
  google: {
    families: ['Inter:wght@400;700']
  }
});


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route element={<ProtectedRoute />}>
          <Route path="/entrepot/dashboard" element={<DashboardPage />} />
          <Route path="/entrepot/stocks" element={<Donrees />} />
          <Route path="/entrepot/entrepots" element={<Entrepots />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
