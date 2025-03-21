import React from "react";
import { Group, User } from "../../types";
import AddGroupMembersModal from "./AddGroupMembersModal";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { NotAdmin } from "../dialog";
import { useGroupUserList } from "../../hooks";
import config from "../../config";

interface GroupProfileProps {
  user: User | null;
  groupProfile: Group | null;
  isAddUserModalOpen: boolean;
  onProfileClick: (userId: string) => void;
  addMemberToGroupChat: (groupId: string, userId: string[]) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  toggleAddUserModal: (status: boolean) => void;
  isGroupAdmin: (group: Group, userId?: string) => boolean;
  updateUserRole: (groupId: string, userId: string, role: string) => void;
}

const GroupUserList: React.FC<GroupProfileProps> = ({
  user,
  groupProfile,
  isAddUserModalOpen,
  onProfileClick,
  addMemberToGroupChat,
  removeMemberFromGroup,
  toggleAddUserModal,
  isGroupAdmin,
  updateUserRole,
}) => {
  if (!user) return;

  const {
    friends,
    openNotAdminDialog,
    updateOpenNotAdminDialog,
    handleRemoveMember,
    handleUpdateUserRole,
  } = useGroupUserList({
    user,
    groupProfile,
    removeMemberFromGroup,
    isGroupAdmin,
    updateUserRole,
  });

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
                      src={`${config.API_URL}/uploads/${member.profile_pic}`}
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
              {member._id !== user._id && (
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
                        onClick={() => handleRemoveMember(member._id)}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
                      >
                        Remove from group
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={() => {
                          handleUpdateUserRole(member._id);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
                      >
                        {!isGroupAdmin(groupProfile, member._id)
                          ? `Create group admin`
                          : `Remove group admin`}
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
              )}
            </div>
          );
        })}
      {openNotAdminDialog && (
        <NotAdmin
          open={openNotAdminDialog}
          handleOpen={updateOpenNotAdminDialog}
        />
      )}
    </div>
  );
};

export default GroupUserList;
