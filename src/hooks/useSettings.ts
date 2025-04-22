import { useState } from "react";
import { UserService } from "../services";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useSettings = () => {
  const { logout, user, togglePrivateProfile } = useAuth();
  const navigate = useNavigate();
  const [publicProfileToggle, setPublicProfileToggle] = useState<boolean>(
    !user?.isPrivate
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const updatePublicProfileToggle = () => {
    setPublicProfileToggle(!publicProfileToggle);
  };

  const updateOpenDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  };

  const handleProfileToggle = async () => {
    try {
      await togglePrivateProfile(publicProfileToggle);
      updatePublicProfileToggle();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await UserService.deleteAccount();
      logout();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleDelete = () => {
    updateOpenDeleteDialog();
    handleDeleteClick();
  };

  const handleUpdatePasswordClick = () => {
    navigate("/settings/update-password");
  };

  return {
    publicProfileToggle,
    openDeleteDialog,
    handleProfileToggle,
    updateOpenDeleteDialog,
    handleDelete,
    handleUpdatePasswordClick,
  };
};

export default useSettings;
