import React, { useEffect, useRef, useState } from "react";
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

  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus(); // Focus the First Name input field when the page loads
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

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

  const handleContactChange = (contact: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: contact,
    }));
  };

  return {
    error,
    formData,
    handleSubmit,
    handleChange,
    signupSuccess,
    handleContactChange,
    firstNameInputRef,
  };
};

export default useSignup;
