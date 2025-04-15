import { useState, useRef, useEffect } from "react";
import { User } from "../types";
import { UserService } from "../services";

interface UserProfileProps {
  profile: User;
  updateUser: () => void;
}

const useUserProfile = ({ profile, updateUser }: UserProfileProps) => {
  const [image, setImage] = useState<string | null>(
    profile.profile_pic || null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile.profile_pic || null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFileUpdated, setIsFileUpdated] = useState<boolean>(false);
  const [openUpdateProfileDialog, setOpenUpdateProfileDialog] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<any>({
    firstName: profile.firstName,
    lastName: profile?.lastName || "",
    bio: profile?.bio || "",
  });

  useEffect(() => {
    setImage(profile.profile_pic || null);
    setImagePreview(profile.profile_pic || null);
    setUserData({
      firstName: profile.firstName,
      lastName: profile?.lastName || "",
      bio: profile?.bio || "",
    });
  }, [profile.profile_pic]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setIsFileUpdated(true);
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Trigger file input when the "Upload Image" button is clicked
  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Open the file input dialog
  };

  const handleSaveClick = async () => {
    if (imagePreview) {
      setIsFileUpdated(true);
      const updatedProfileImage = await UserService.updateProfilePicture(
        selectedImage as File
      );
      setImage(updatedProfileImage.filename);
      setImagePreview(updatedProfileImage.filename);
      setIsFileUpdated(false);
      updateUser();
    }
    setIsModalOpen(false);
  };

  const updateSetModalOpen = (status: boolean) => {
    setIsModalOpen(status);
    setSelectedImage(null);
    setImagePreview(profile.profile_pic || null);
    if (!status) {
      setIsFileUpdated(false);
    }
  };

  const updateProfileDetails = async (
    firstName: string,
    lastName: string = "",
    bio: string = ""
  ) => {
    await UserService.updateProfileDetails(firstName, lastName, bio);
    updateUser();
  };
  const updateOpenUpdateProfileDialog = () => {
    setOpenUpdateProfileDialog(!openUpdateProfileDialog);
    setUserData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
    });
  };
  const handleEditClick = () => {
    updateOpenUpdateProfileDialog();
  };

  const updateProfileDetailsHandler = (
    firstName: string,
    lastName: string = "",
    bio: string = ""
  ) => {
    updateProfileDetails(firstName, lastName, bio);
    updateOpenUpdateProfileDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    image,
    selectedImage,
    imagePreview,
    isModalOpen,
    fileInputRef,
    isFileUpdated,
    userData,
    openUpdateProfileDialog,
    handleImageClick,
    handleFileChange,
    handleUploadClick,
    handleSaveClick,
    updateSetModalOpen,
    handleEditClick,
    updateProfileDetailsHandler,
    updateOpenUpdateProfileDialog,
    handleChange,
  };
};

export default useUserProfile;
