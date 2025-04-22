import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { UserService } from "../services";

const useResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      alert("Invalid request");
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UserService.resetPassword(newPassword, token!);
      if (response) {
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
        alert("Password updated successfully");
      }
    } catch (err) {
      setError("An error occurred while resetting the password");
    }
  };

  const updateNewPassword = (password: string) => {
    setNewPassword(password);
  };
  const updateConfirmPassword = (password: string) => {
    setConfirmPassword(password);
  };
  const updateShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const updateShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    error,
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    handleSubmit,
    updateNewPassword,
    updateConfirmPassword,
    updateShowNewPassword,
    updateShowConfirmPassword,
  };
};

export default useResetPassword;
