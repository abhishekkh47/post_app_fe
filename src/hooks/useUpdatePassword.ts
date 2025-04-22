import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services";

const useUpdatePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await UserService.updatePassword(
        oldPassword,
        newPassword
      );
      if (response) {
        setSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      setError("Invalid password");
    }
  };

  const updateOldPassword = (password: string) => {
    setOldPassword(password);
  };
  const updateNewPassword = (password: string) => {
    setNewPassword(password);
  };
  const updateConfirmNewPassword = (password: string) => {
    setConfirmNewPassword(password);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return {
    error,
    oldPassword,
    newPassword,
    confirmNewPassword,
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    handleSubmit,
    updateOldPassword,
    updateNewPassword,
    updateConfirmNewPassword,
    setShowOldPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    success,
    handleCancel,
  };
};

export default useUpdatePassword;
