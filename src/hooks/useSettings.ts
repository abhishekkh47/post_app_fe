import { useState } from "react";
import { UserService } from "../services";
import { useAuth } from "../context/AuthContext";

const useSettings = () => {
  const { logout, user } = useAuth();
  console.log("user?.isPrivate : ", user?.isPrivate);
  const [publicProfileToggle, setPublicProfileToggle] = useState<boolean>(
    !user?.isPrivate
  );

  const handleProfileToggle = async () => {
    try {
      await UserService.toggleProfileType(publicProfileToggle);
      setPublicProfileToggle(!publicProfileToggle);
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
