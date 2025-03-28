import React from "react";
import { Group, GroupDetails } from "../../types";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { NotAdmin, EditGroupDetails, GroupInviteLink } from "../dialog";
import { useGroupProfile } from "../../hooks";
import config from "../../config";

interface GroupProfileProps {
  groupProfile: Group | null;
  isGroupAdmin: (group: Group) => boolean;
  updateGroupDetails: (groupId: string, data: GroupDetails) => void;
  fetchGroupDetails: () => void;
}

const GroupProfile: React.FC<GroupProfileProps> = ({
  groupProfile,
  isGroupAdmin,
  updateGroupDetails,
  fetchGroupDetails,
}) => {
  if (!groupProfile) {
    return <div>Loading profile...</div>;
  }

  const {
    groupData,
    openNotAdminDialog,
    openUpdateGroupDialog,
    fileInputRef,
    openGroupInviteOptions,
    handleEditClick,
    updateGroupDetailsHandler,
    handleChange,
    updateOpenNotAdminDialog,
    updateOpenUpdateGroupDialog,
    handleUploadClick,
    handleFileChange,
    updateOpenGroupInviteOptions,
    handleResetLink,
  } = useGroupProfile({
    groupProfile,
    isGroupAdmin,
    updateGroupDetails,
    fetchGroupDetails,
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Menu as="div" className="relative">
        <div className="justify-self-end">
          <MenuButton className="relative flex focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <MenuItem>
            <a
              onClick={() => {
                handleEditClick();
              }}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
            >
              Edit details
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                updateOpenGroupInviteOptions();
              }}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
            >
              Invite via link
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>
      {openNotAdminDialog && (
        <NotAdmin
          open={openNotAdminDialog}
          handleOpen={updateOpenNotAdminDialog}
        />
      )}
      {openUpdateGroupDialog && (
        <EditGroupDetails
          open={openUpdateGroupDialog}
          handleOpen={updateOpenUpdateGroupDialog}
          handler={updateGroupDetailsHandler}
          formData={groupData}
          handleChange={handleChange}
        />
      )}
      <div className="justify-items-center">
        <Menu as="div" className="relative inline-block">
          <MenuButton className="focus:outline-none">
            {groupData?.profile_pic ? (
              <img
                src={`${config.API_URL}/uploads/${groupData.profile_pic}`}
                alt={groupData.name}
                loading="lazy"
                className="h-20 w-20 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-blue-300 flex items-center justify-center text-[50px] border border-black cursor-pointer">
                {groupData?.name[0]?.toUpperCase()}
              </div>
            )}
          </MenuButton>

          <MenuItems
            transition
            className="absolute z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <MenuItem
              as="button"
              onClick={() =>
                window.open(
                  `${config.API_URL}/uploads/${groupData.profile_pic}`,
                  "_blank"
                )
              }
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100"
            >
              View Image
            </MenuItem>
            <MenuItem
              as="button"
              onClick={() => handleUploadClick()}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100"
            >
              Update Image
            </MenuItem>
          </MenuItems>
        </Menu>
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex">
          <h2 className="text-2xl font-bold">{groupProfile?.name}</h2>
        </div>
        {groupProfile.description && (
          <p className="text-gray-600 mt-1">{groupProfile.description}</p>
        )}
      </div>
      {openGroupInviteOptions && (
        <GroupInviteLink
          groupData={groupData}
          open={openGroupInviteOptions}
          handleCancel={updateOpenGroupInviteOptions}
          inviteToken={groupProfile?.inviteToken}
          handleResetLink={handleResetLink}
        />
      )}
    </div>
  );
};

export default GroupProfile;
