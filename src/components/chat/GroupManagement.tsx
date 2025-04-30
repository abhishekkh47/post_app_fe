// This component is deprecated
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupChatService } from "../../services";
import { User } from "../../types";

interface GroupManagementProps {
  users: User[];
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

const GroupManagement: React.FC<GroupManagementProps> = ({ users, user }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const navigate = useNavigate();

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

    if (!newGroupName.trim()) {
      return;
    }

    try {
      const response = await GroupChatService.createGroup(
        newGroupName,
        newGroupDescription,
        selectedUsers
      );

      const newGroup = response.group;

      // Add the new group to the list
      setGroups((prev) => [...prev, newGroup]);

      // Reset form
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedUsers([]);
      setShowCreateForm(false);

      // Navigate to the new group
      navigate(`/groups/${newGroup._id}`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleUserToggle = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedUsers((prev) => [...prev, userId]);
    }
  };

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Groups</h1>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create Group"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Group</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Add Members</label>
              <div className="max-h-60 overflow-y-auto border rounded p-2">
                {users.map((user: any) => (
                  <div key={user._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`user-${user._id}`}
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserToggle(user._id)}
                      className="mr-2"
                    />
                    <label htmlFor={`user-${user._id}`}>
                      {user.firstName || user.email}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Create Group
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded">
          <p>You don't have any groups yet.</p>
          <button
            className="mt-2 text-blue-500 hover:underline"
            onClick={() => setShowCreateForm(true)}
          >
            Create your first group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => handleGroupClick(group._id)}
              className="border rounded p-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold">{group.name}</h3>
                <div className="text-sm">
                  {group.members.length}{" "}
                  {group.members.length === 1 ? "member" : "members"}
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-2 mb-4 line-clamp-2">
                {group.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </span>

                <div>
                  {isGroupAdmin(group) ? (
                    <button
                      onClick={(e) => handleDeleteGroup(group._id, e)}
                      className="text-red-500 text-sm ml-2 hover:underline"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleLeaveGroup(group._id, e)}
                      className="text-gray-500 text-sm ml-2 hover:underline"
                    >
                      Leave
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
