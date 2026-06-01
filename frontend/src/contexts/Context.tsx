import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User, UserStats } from "../lib/types";
import axiosFetch from "../lib/axiosFetch";

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  userStats: UserStats | null;
  setUserStats: Dispatch<SetStateAction<UserStats | null>>;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Create contexts
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider components
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setUserStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const authResponse = await axiosFetch.get<{
        success: boolean;
        user: User;
      }>("/api/user/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (authResponse.data.success) {
        setUser(authResponse.data.user);
        
        // Fetch platform data inside context provider
        const platformDataResponse = await axiosFetch.get("/api/platform/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (platformDataResponse.data) {
          setUserStats(platformDataResponse.data);
        }
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setUserStats(null);
      }
    } catch (error) {
      console.error("Error verifying token in global context:", error);
      const err = error as { response?: { status: number } };
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        setUser(null);
        setUserStats(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserStats(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userStats,
        setUserStats,
        loading,
        logout,
        refreshUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for UserContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
