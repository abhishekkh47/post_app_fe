import { useState, useRef } from "react";
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

  const handleImageClick = () => {
    if (image) {
      setIsModalOpen(true);
    }
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
      setImage(imagePreview);
      await UserService.updateProfilePicture(selectedImage as File);
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

  return {
    image,
    selectedImage,
    imagePreview,
    isModalOpen,
    fileInputRef,
    isFileUpdated,
    handleImageClick,
    handleFileChange,
    handleUploadClick,
    handleSaveClick,
    updateSetModalOpen,
  };
};

export default useUserProfile;
