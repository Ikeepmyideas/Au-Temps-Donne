import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSessionTimeout } from './useSessionTimeout'; 

const ProtectedRoute = () => {
  const isAuth = !!localStorage.getItem('accessToken'); // Check if user is authenticated

  useSessionTimeout(); // Assuming this hook manages session timeout functionality

  if (!isAuth) {
    // If user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the child routes using Outlet
  return <Outlet />;
};

export default ProtectedRoute;
