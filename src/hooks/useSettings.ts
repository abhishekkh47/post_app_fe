import { useState } from "react";
import { UserService } from "../services";
import { useAuth } from "../context/AuthContext";

const useSettings = () => {
  const { logout, user, togglePrivateProfile } = useAuth();
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

  return {
    publicProfileToggle,
    openDeleteDialog,
    handleProfileToggle,
    updateOpenDeleteDialog,
    handleDelete,
  };
};

export default useSettings;
