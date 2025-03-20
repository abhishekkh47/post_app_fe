import React, { useState } from "react";
import { User } from "../../types";

interface CreateChatGroupProps {
  isOpen: boolean;
  onClose: any;
  users: any;
  user: User;
  groupProfile: any;
  addMemberToGroupChat: (groupId: string, userId: string[]) => void;
}

const AddGroupMembersModal: React.FC<CreateChatGroupProps> = ({
  isOpen,
  onClose,
  users,
  //   user,
  groupProfile,
  addMemberToGroupChat,
}) => {
  if (!isOpen) return null;
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleMemberToggle = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
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
                  disabled={groupProfile.members.some(
                    (member: any) => member.userId === user._id
                  )}
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
              onClick={() =>
                addMemberToGroupChat(groupProfile._id, selectedMembers)
              }
              disabled={selectedMembers.length ? false : true}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGroupMembersModal;
