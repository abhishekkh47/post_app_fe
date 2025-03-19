import React, { useState } from "react";
import { User } from "../../types";
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
  newGroupCreated: () => void;
}

const CreateChatGroup: React.FC<CreateChatGroupProps> = ({
  isOpen,
  onClose,
  users,
  modalPage,
  updateModalPage,
  user,
  newGroupCreated,
}) => {
  if (!isOpen) return null;
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

  const isGroupAdmin = (group: Group) => {
    return group.members.some(
      (member) => member.userId === user._id && member.role === "admin"
    );
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
