import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "../types";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  loading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setAuthData = (data: AuthResponse) => {
    const expiryTime = Date.now() + 60 * 60 * 1000;
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("tokenExpiry", expiryTime.toString());
    setUser(data.user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && userData && tokenExpiry) {
      const currentTime = Date.now();
      const expiryTime = parseInt(tokenExpiry, 10);

      if (currentTime > expiryTime) {
        refreshToken();
      } else {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const refreshToken = async () => {
    try {
      const data: AuthResponse = await AuthService.refreshToken();
      setAuthData(data);
    } catch (error) {
      logout();
      navigate("/");
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const data: AuthResponse = await AuthService.login(credentials);
      setAuthData(data);
    } catch (err) {
      throw new Error(`${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
    return true;
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const data: AuthResponse = await AuthService.signup(credentials);
      setAuthData(data);
    } catch (err) {
      throw new Error(`${(err as Error).message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
