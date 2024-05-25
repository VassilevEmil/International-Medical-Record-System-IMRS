import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from "axios";
import { decode as jwtDecode } from "react-native-pure-jwt";

interface AuthContextType {
  token: string | null;
  patientId: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedToken = await EncryptedStorage.getItem("token");
        const storedPatientId = await EncryptedStorage.getItem("patientId");
        if (storedToken && storedPatientId) {
          const decoded = await jwtDecode(storedToken, "noSecretKey", { skipValidation: true });
          if (decoded.payload.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setPatientId(storedPatientId);
          } else {
            await EncryptedStorage.removeItem("token");
            await EncryptedStorage.removeItem("patientId");
            setToken(null);
            setPatientId(null);
          }
        }
      } catch (error) {
        console.error("Failed to decode or verify token:", error);
        await EncryptedStorage.removeItem("token");
        await EncryptedStorage.removeItem("patientId");
        setToken(null);
        setPatientId(null);
      }
      setIsLoading(false);
    };
    loadCredentials();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("https://imrs-server-12m3e12kdk1k12mek.tech/api/auth/login", { email, password });
      const { token, patientId } = response.data.response;

      await EncryptedStorage.setItem("token", token);
      await EncryptedStorage.setItem("patientId", patientId);
      setToken(token);
      setPatientId(patientId);
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || "An error occurred during login.";
        switch (error.response.status) {
          case 400:
          case 401:
            errorMessage = "Invalid email or password.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
      console.error("Login error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    await EncryptedStorage.removeItem("token");
    await EncryptedStorage.removeItem("patientId");
    setToken(null);
    setPatientId(null);
  };

  return (
    <AuthContext.Provider value={{ token, patientId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
