import { useState } from "react";
import { ChatService } from "../services";

const useCreateChatGroup = (onClose: any) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupDescription, setGroupDescription] = useState("");
  const [groupPic, setGroupPic] = useState(null);

  const handleMemberToggle = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleFileChange = (event: any) => {
    setGroupPic(event.target.files[0]);
  };

  const handleGroupDescriptionChange = (event: any) => {
    setGroupDescription(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("description", groupDescription);
    formData.append("members", JSON.stringify(selectedMembers));
    if (groupPic) {
      formData.append("profilePic", groupPic);
    }

    try {
      const response = await ChatService.createChatGroup(formData);
      if (response.status === 200) {
        // Handle successful group creation (e.g., update UI)
        onClose(); // Close modal
      }
    } catch (error) {
      console.error("Error creating group chat", error);
    }
  };

  const handleCancel = () => {
    setSelectedMembers([]);
    onClose();
  };

  return {
    selectedMembers,
    groupDescription,
    groupPic,
    handleMemberToggle,
    handleFileChange,
    handleGroupDescriptionChange,
    handleSubmit,
    handleCancel,
  };
};

export default useCreateChatGroup;
