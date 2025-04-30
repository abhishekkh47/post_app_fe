import React from "react";
import { User } from "../../types";
import { useCreateChatGroup } from "../../hooks";

interface CreateChatGroupProps {
  isOpen: any;
  onClose: () => void;
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
  newGroupCreated,
}) => {
  if (!isOpen) return null;
  const {
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
  } = useCreateChatGroup({ newGroupCreated, onClose });

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
