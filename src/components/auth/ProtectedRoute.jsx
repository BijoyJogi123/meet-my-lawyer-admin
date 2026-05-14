import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
