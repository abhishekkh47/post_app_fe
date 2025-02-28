import { useState, useEffect } from "react";
import {
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "../types";
import { useNavigate } from "react-router-dom";
import { AuthService, UserService } from "../services";
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
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
      navigate("/");
    }
  };

  const login = async (credentials: LoginCredentials) => {
    // setLoading(true);
    try {
      const data: AuthResponse = await AuthService.login(credentials);
      setAuthData(data);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      throw new Error(`${(err as Error).message}`);
    }
    // finally {
    //   setLoading(false);
    // }
    return true;
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const data: AuthResponse = await AuthService.signup(credentials);
      setAuthData(data);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      throw new Error(`${(err as Error).message}`);
    }
  };

  const updateUser = async () => {
    try {
      if (user) {
        const response: User = (await UserService.fetchUserProfile(user?._id))
          .userDetails;
        console.log("response : ", response);
        if (response) {
          console.log("SETTING USER  : >>", user);
          localStorage.setItem("user", JSON.stringify(response));
          setUser(response);
          console.log("USER SET  : >>", user);
        }
      }
    } catch (error) {
      throw new Error(`${(error as Error).message}`);
    }
  };

  const togglePrivateProfile = async (currentStatus: boolean) => {
    if (user) {
      await UserService.toggleProfileType(currentStatus);
      await updateUser();
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
    togglePrivateProfile,
    updateUser,
  };
};

export default useAuthContext;
