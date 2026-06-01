import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/Context";
import LoadingPage from "../pages/Loading";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <LoadingPage />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
