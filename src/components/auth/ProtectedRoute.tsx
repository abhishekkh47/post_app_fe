import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";

interface ProctedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProctedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
