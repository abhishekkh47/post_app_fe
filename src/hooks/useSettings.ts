import { useState } from "react";
import { UserService } from "../services";
import { useAuth } from "../context/AuthContext";

const useSettings = () => {
  const { logout, user, togglePrivateProfile } = useAuth();
  const [publicProfileToggle, setPublicProfileToggle] = useState<boolean>(
    !user?.isPrivate
  );

  const updatePublicProfileToggle = (publicProfileToggle: boolean) => {
    setPublicProfileToggle(publicProfileToggle);
  };

  const handleProfileToggle = async () => {
    try {
      await togglePrivateProfile(publicProfileToggle);
      updatePublicProfileToggle(!publicProfileToggle);
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

  return { publicProfileToggle, handleProfileToggle, handleDeleteClick };
};

export default useSettings;
