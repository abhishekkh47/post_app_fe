import React, { useState } from "react";
import { User } from "../../types";
import { ChatService } from "../../services";

interface CreateChatGroupProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  modalPage: number;
  updateModalPage: (page: number) => void;
}

const CreateChatGroup: React.FC<CreateChatGroupProps> = ({
  isOpen,
  onClose,
  users,
  modalPage,
  updateModalPage,
}) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupPic, setGroupPic] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setGroupPic(event.target.files[0]);
    }
  };

  const handleGroupDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setGroupDescription(event.target.value);
  };

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      setError("Please select at least one member");
      return;
    }

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", groupName);
      formData.append("description", groupDescription);
      formData.append("members", JSON.stringify(selectedMembers));

      if (groupPic) {
        formData.append("profilePic", groupPic);
      }

      const response = await ChatService.createChatGroup(formData);

      if (response) {
        resetForm();
        onClose(); // Close modal on success
      }
    } catch (error) {
      console.error("Error creating group chat", error);
      setError("Failed to create group chat. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMembers([]);
    setGroupName("");
    setGroupDescription("");
    setGroupPic(null);
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Don't render anything if modal isn't open
  if (!isOpen) return null;

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
                disabled={selectedMembers.length < 1 ? true : false}
              >
                Next
              </button>
              {error && (
                <div
                  className="error-message"
                  style={{ color: "red", padding: "10px" }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Second Modal Page: Group Details */}
        {modalPage === 2 && (
          <div className="mt-4">
            <h3 className="mb-2">Group Details</h3>
            <input
              type="text"
              value={groupName}
              onChange={handleGroupNameChange}
              placeholder="Group name"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            <textarea
              value={groupDescription}
              onChange={handleGroupDescriptionChange}
              placeholder="Group description"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <input type="file" onChange={handleFileChange} className="mb-4" />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
                onClick={handleSubmit}
                type="button"
                disabled={
                  !groupName || !groupDescription || isSubmitting ? true : false
                }
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
