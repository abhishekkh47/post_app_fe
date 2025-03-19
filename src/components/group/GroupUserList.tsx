import React, { useEffect, useState } from "react";
import { Group, User } from "../../types";
import AddGroupMembersModal from "./AddGroupMembersModal";
import { FollowService } from "../../services";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface GroupProfileProps {
  user: User | null;
  groupProfile: Group | null;
  isAddUserModalOpen: boolean;
  onProfileClick: (userId: string) => void;
  addMemberToGroupChat: (groupId: string, userId: string[]) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  toggleAddUserModal: (status: boolean) => void;
}

const GroupUserList: React.FC<GroupProfileProps> = ({
  user,
  groupProfile,
  isAddUserModalOpen,
  onProfileClick,
  addMemberToGroupChat,
  removeMemberFromGroup,
  toggleAddUserModal,
}) => {
  if (!user) return;

  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      if (user) {
        const myFriends = await FollowService.getFriends();
        setFriends(myFriends.friends || []);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 font-bold mb-2">Members</div>
        <div
          onClick={() => toggleAddUserModal(true)}
          className="text-blue-600 mb-2 hover:cursor-pointer"
        >
          Add friends
        </div>
        <AddGroupMembersModal
          isOpen={isAddUserModalOpen}
          onClose={() => toggleAddUserModal(false)}
          users={friends} // Pass the list of users to choose from
          user={user}
          groupProfile={groupProfile}
          addMemberToGroupChat={addMemberToGroupChat}
        />
      </div>
      {groupProfile?.members?.length &&
        groupProfile.members.map((member) => {
          return (
            <div
              className="flex flex-row items-center space-x-4 p-2"
              key={member._id}
            >
              <div className="flex-1">
                <div
                  className="flex flex-row items-center space-x-4 hover:cursor-pointer"
                  onClick={() => onProfileClick(member._id)}
                >
                  {member?.profile_pic ? (
                    <img
                      src={member.profile_pic}
                      alt={member.firstName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center text-[30px] border border-black">
                      {member?.firstName[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    {member.firstName} {member.lastName}
                  </div>
                </div>
              </div>
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <EllipsisVerticalIcon className="size-5" />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      onClick={() =>
                        removeMemberFromGroup(groupProfile._id, member._id)
                      }
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
                    >
                      Remove from group
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      onClick={() => {}}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
                    >
                      Message
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          );
        })}
    </div>
  );
};

export default GroupUserList;
