import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// Define the shape of the user object
type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

// Define the shape of the authentication data
type AuthData = {
  token: string;
};

// Define the shape of the context
type AuthContextType = {
  authData: AuthData | null;
  setAuthData: (data: AuthData | null) => void;
  fetchUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  authData: null,
  setAuthData: () => {},
  fetchUserProfile: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
});

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load authData from SecureStore when the app starts
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedData = await SecureStore.getItemAsync("authData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setAuthData(parsedData);

          // Fetch user profile if token exists
          if (parsedData.token) {
            await fetchUserProfile();
          }
        }
      } catch (error) {
        console.error("Failed to load authData from SecureStore:", error);
        setError("Failed to load authentication data.");
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Save authData to SecureStore whenever it changes
  const updateAuthData = async (data: AuthData | null) => {
    try {
      if (data) {
        await SecureStore.setItemAsync("authData", JSON.stringify(data));
      } else {
        await SecureStore.deleteItemAsync("authData");
      }
      setAuthData(data);
    } catch (error) {
      console.error("Failed to save authData to SecureStore:", error);
      setError("Failed to save authentication data.");
    }
  };

  // Fetch user profile using the token
  const fetchUserProfile = async () => {
    if (!authData?.token) {
      setError("No token found.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<{ data: { user: User } }>(
        "https://sbparish.or.ke/adncmatechnical/api/user",
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      const userData = response.data.data.user;
      setAuthData((prevData) => ({
        ...prevData!,
        user: userData,
      }));
      setError(null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to fetch user profile."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      updateAuthData(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authData");
      setAuthData(null);
      setError(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      setError("Failed to logout.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData: updateAuthData,
        fetchUserProfile,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
