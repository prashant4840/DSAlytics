import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosFetch from "../lib/axiosFetch";
import { User } from "../lib/types";
import { useUserContext } from "../contexts/Context";
import LoadingPage from "../pages/Loading";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { setUser, setUserStats } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const authResponse = await axiosFetch.get<{
          success: boolean;
          user: User;
        }>("/api/user/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authResponse.data.success) throw new Error("Not authorized");

        const platformDataResponse = await axiosFetch.get(
          "/api/platform/data",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(authResponse.data.user);
        if (platformDataResponse.data) setUserStats(platformDataResponse.data);
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.error("Rate limit exceeded:", error.response.data.message);
          window.location.href = "/";
        } else {
          console.error("Authentication or data fetching error:", error);
        }
        setIsAuthenticated(false);
      }
    };

    fetchData();
  }, [setUser, setUserStats]);

  if (isAuthenticated === null) {
    return <LoadingPage />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
