import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { login } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login({ email, password });
      if (success) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const updateEmail = (email: string) => {
    setEmail(email);
  };

  const updatePassword = (password: string) => {
    setPassword(password);
  };

  return {
    error,
    email,
    password,
    handleSubmit,
    updateEmail,
    updatePassword,
    setError,
    navigate,
  };
};
export default useLogin;
