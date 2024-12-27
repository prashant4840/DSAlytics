import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosFetch from "../lib/axiosFetch";
import { User } from "../lib/types";

interface ProtectedRouteProps {
  children: JSX.Element;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  setUser,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosFetch.post<{
          success: boolean;
          user: User;
        }>(
          "/api/user/verify",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsAuthenticated(response.data.success);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error verifying authentication:", error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
