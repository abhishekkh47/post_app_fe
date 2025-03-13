import React, { useState } from "react";
import { User } from "../../types";
import { useNavigate } from "react-router-dom";
import { GroupChatService } from "../../services";

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
interface CreateChatGroupProps {
  isOpen: any;
  onClose: any;
  users: any;
  modalPage: number;
  updateModalPage: (page: number) => void;
  user: User;
}

const CreateChatGroup: React.FC<CreateChatGroupProps> = ({
  isOpen,
  onClose,
  users,
  modalPage,
  updateModalPage,
  user,
}) => {
  if (!isOpen) return null;
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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Group Chat</h2>

        {/* First Modal Page: Select Members */}
        {modalPage === 1 && (
          <div>
            <h3 className="mb-2">Select Members</h3>
            <div className="space-y-2">
              {users.map((user: User) => (
                <div key={user._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={user._id}
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => handleMemberToggle(user._id)}
                    className="mr-2"
                  />
                  <label htmlFor={user._id}>
                    {user.firstName} {user.lastName}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
                onClick={() => updateModalPage(2)} // Move to the second modal page
                disabled={selectedMembers.length ? false : true}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Second Modal Page: Group Description & Profile Pic */}
        {modalPage === 2 && (
          <div className="mt-4">
            <h3 className="mb-2">Group Details</h3>
            <input
              type="text"
              value={groupName}
              onChange={handleGroupNameChange}
              className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Group Name"
            />
            <textarea
              value={groupDescription}
              onChange={handleGroupDescriptionChange}
              placeholder="Group Description"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="file"
              value={groupPic || ""}
              onChange={handleFileChange}
              className="mb-4"
            />
            {/* </div> */}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
                onClick={handleCreateGroup}
                disabled={groupName.length ? false : true}
              >
                Create Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChatGroup;
