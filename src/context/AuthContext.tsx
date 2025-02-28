import React, { createContext, useContext } from "react";
import { User, LoginCredentials, SignupCredentials } from "../types";
import { useAuthContext } from "../hooks";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
  togglePrivateProfile: (currentStatus: boolean) => Promise<void>;
  updateUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  loading: false,
  togglePrivateProfile: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    signup,
    refreshToken,
    togglePrivateProfile,
    updateUser,
  } = useAuthContext();

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
        togglePrivateProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
