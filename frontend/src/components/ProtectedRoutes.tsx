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
  const { setUser, setUserStats, isAuthenticated, setIsAuthenticated } =
    useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const [authResponse, platformDataResponse] = await Promise.all([
          axiosFetch.post<{ success: boolean; user: User }>(
            "/api/user/verify",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axiosFetch.get("/api/platform/data", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setIsAuthenticated(authResponse.data.success);
        setUser(authResponse.data.user);

        if (platformDataResponse.data) {
          setUserStats(platformDataResponse.data);
        }
      } catch (error) {
        console.error("Error during authentication or fetching data:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
