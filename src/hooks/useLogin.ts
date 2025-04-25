import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  const location = useLocation();

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus(); // Focus the First Name input field when the page loads
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login({ email, password });
      if (success) {
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const updateEmail = (email: string) => {
    setEmail(email);
  };

  const updatePassword = (email: string) => {
    setPassword(email);
  };

  const updateShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    error,
    email,
    password,
    showPassword,
    handleSubmit,
    updateEmail,
    updatePassword,
    navigate,
    updateShowPassword,
    emailInputRef,
  };
};
export default useLogin;
