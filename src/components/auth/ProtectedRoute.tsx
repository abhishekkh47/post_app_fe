import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";
import { HomeShimmer } from "../shimmer";

interface ProctedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProctedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <HomeShimmer />;
    // return <div>Loading...</div>;
  }
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
