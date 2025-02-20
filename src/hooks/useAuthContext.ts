import { useState, useEffect } from "react";
import {
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "../types";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services";
import { removeAuthData, setAuthData } from "../utils";

const useAuthContext = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
    removeAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    login,
    signup,
    logout,
    refreshToken,
    user,
    isAuthenticated,
    loading,
  };
};

export default useAuthContext;
