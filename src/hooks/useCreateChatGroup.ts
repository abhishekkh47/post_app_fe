import { useState } from "react";
import { ChatService, GroupChatService } from "../services";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

interface CreateChatGroupProps {
  onClose: () => void;
  user: User;
}
interface Group {
  _id: string;
  name: string;
  description: string;
  avatar?: string;
  members: {
    userId: string;
    role: string;
    joinedAt: Date;
  }[];
  createdAt: Date;
}

const useCreateChatGroup = ({ onClose, user }: CreateChatGroupProps) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [groupPic, setGroupPic] = useState<string | null>(null);

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  // const [showCreateForm, setShowCreateForm] = useState(false);
  // const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const navigate = useNavigate();

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

  // const handleSubmit = async () => {
  //   const formData = new FormData();
  //   formData.append("description", groupDescription);
  //   formData.append("members", JSON.stringify(selectedMembers));
  //   if (groupPic) {
  //     formData.append("profilePic", groupPic);
  //   }

  //   try {
  //     const response = await ChatService.createChatGroup(formData);
  //     if (response.status === 200) {
  //       // Handle successful group creation (e.g., update UI)
  //       onClose(); // Close modal
  //     }
  //   } catch (error) {
  //     console.error("Error creating group chat", error);
  //   }
  // };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      // const response = await fetch("/api/groups");
      const response = await GroupChatService.getGroups();
      console.log("response : ", response);
      setGroups(response.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return;
    }

    try {
      const response = await GroupChatService.createGroup(
        groupName,
        groupDescription,
        selectedMembers
      );

      const newGroup = response.group;

      // Add the new group to the list
      setGroups((prev) => [...prev, newGroup]);

      // Reset form
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      onClose();
      // setShowCreateForm(false);

      // Navigate to the new group
      // navigate(`/groups/${newGroup._id}`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // const handleUserToggle = (userId: string) => {
  //   if (selectedUsers.includes(userId)) {
  //     setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  //   } else {
  //     setSelectedUsers((prev) => [...prev, userId]);
  //   }
  // };

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const isGroupAdmin = (group: Group) => {
    return group.members.some(
      (member) => member.userId === user._id && member.role === "admin"
    );
  };

  const handleDeleteGroup = async (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to group

    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }

    try {
      await GroupChatService.deleteGroup(groupId);

      // Remove group from list
      setGroups((prev) => prev.filter((group) => group._id !== groupId));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleLeaveGroup = async (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to group

    try {
      await GroupChatService.removeGroupMember(groupId, user._id);

      // Remove group from list or refresh to update
      fetchGroups();
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleCancel = () => {
    setSelectedMembers([]);
    onClose();
  };

  return {
    groupName,
    selectedMembers,
    groupDescription,
    groupPic,
    handleMemberToggle,
    handleFileChange,
    handleGroupNameChange,
    handleGroupDescriptionChange,
    handleCreateGroup,
    handleGroupClick,
    isGroupAdmin,
    handleDeleteGroup,
    handleLeaveGroup,
    handleCancel,
  };
};

export default useCreateChatGroup;
