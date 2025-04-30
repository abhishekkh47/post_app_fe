import { useState } from "react";
import { GroupChatService } from "../services";

interface CreateChatGroupProps {
  newGroupCreated: () => void;
  onClose: () => void;
}

const useCreateChatGroup = ({
  newGroupCreated,
  onClose,
}: CreateChatGroupProps) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [groupPic, setGroupPic] = useState<string | null>(null);

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

  const handleGroupNameChange = (event: any) => {
    setGroupName(event.target.value);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return;
    }

    try {
      await GroupChatService.createGroup(
        groupName,
        groupDescription,
        selectedMembers
      );

      newGroupCreated();
      // Reset form
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleCancel = () => {
    setSelectedMembers([]);
    onClose();
  };

  return {
    selectedMembers,
    groupDescription,
    groupName,
    groupPic,
    handleMemberToggle,
    handleFileChange,
    handleGroupDescriptionChange,
    handleGroupNameChange,
    handleCreateGroup,
    handleCancel,
  };
};

export default useCreateChatGroup;
