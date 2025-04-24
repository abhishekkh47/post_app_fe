import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SignupCredentials } from "../types";

const useSignup = () => {
  const [formData, setFormData] = useState<SignupCredentials>({
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    isPrivate: true,
    contact: "",
    gender: "M",
    countryCode: "+91",
  });
  const [error, setError] = useState<string>("");
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
      setSignupSuccess(true);
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // [name]: type === "checkbox" ? checked : value,
      [name]: value,
    }));
  };

  return {
    error,
    formData,
    handleSubmit,
    handleChange,
    signupSuccess,
  };
};

export default useSignup;
