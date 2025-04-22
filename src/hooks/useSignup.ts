import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const useSignup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    bio: "",
    isPrivate: true,
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    error,
    formData,
    showPassword,
    handleSubmit,
    handleChange,
    updateShowPassword,
  };
};

export default useSignup;
