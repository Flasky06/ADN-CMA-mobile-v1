import axios from "axios";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userData: any; // Add this to store user data
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null); // Add this to store user data

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "https://sbparish.or.ke/adncmatechnical/api/login",
        {
          email,
          password,
        }
      );

      const responseData = response.data;

      if (responseData.status === "success") {
        setIsAuthenticated(true);
        setUserEmail(email);
        setUserData(responseData.data.user); // Store user data
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserData(null); // Clear user data
  };

  const value = {
    isAuthenticated,
    userEmail,
    userData, // Include user data in the context value
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
