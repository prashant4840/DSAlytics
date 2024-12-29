import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User, UserStats } from "../lib/types";

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  userStats: UserStats | null;
  setUserStats: Dispatch<SetStateAction<UserStats | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userStats,
        setUserStats,
        isAuthenticated,
        setIsAuthenticated,
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
