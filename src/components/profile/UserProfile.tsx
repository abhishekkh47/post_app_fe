import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { UserStats, FollowButton, ProfilePicture } from "./";
import { User } from "../../types";
import { useUserProfile } from "../../hooks";
import { EditProfileDetails } from "../dialog";

interface UserProfileProps {
  user: User | null;
  profile: User | null;
  isFollowing: boolean;
  handleFollow: () => {};
  updateUser: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  profile,
  handleFollow,
  isFollowing,
  updateUser,
}) => {
  if (!profile) {
    // return <div>Loading profile...</div>;
    return;
  }

  const {
    image,
    imagePreview,
    isModalOpen,
    fileInputRef,
    isFileUpdated,
    userData,
    openUpdateProfileDialog,
    handleImageClick,
    handleFileChange,
    handleUploadClick,
    handleSaveClick,
    updateSetModalOpen,
    handleEditClick,
    updateProfileDetailsHandler,
    updateOpenUpdateProfileDialog,
    handleChange,
  } = useUserProfile({ profile, updateUser });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {user?._id === profile._id && (
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
          </MenuItems>
        </Menu>
      )}
      {openUpdateProfileDialog && (
        <EditProfileDetails
          open={openUpdateProfileDialog}
          handleOpen={updateOpenUpdateProfileDialog}
          handler={updateProfileDetailsHandler}
          formData={userData}
          handleChange={handleChange}
        />
      )}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative inline-block" onClick={handleImageClick}>
          <ProfilePicture
            profile_pic={image}
            firstName={profile.firstName}
            size={20}
            text={`[50px]`}
            className={`w-20 h-20`}
          />
        </div>

        {/* Image Preview Modal */}
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg">
              <button
                onClick={() => updateSetModalOpen(false)}
                className="absolute top-2 right-2 text-xl text-black"
              >
                X
              </button>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  loading="lazy"
                  className="w-96 h-96 object-cover rounded-lg"
                />
              )}

              {/* Button to trigger file input */}
              {user?._id == profile._id && (
                <button
                  onClick={isFileUpdated ? handleSaveClick : handleUploadClick}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {isFileUpdated ? `Save` : `Upload Image`}
                </button>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <UserStats profile={user?._id !== profile._id ? profile : user} />
        </div>
        {user?._id !== profile._id && (
          <FollowButton following={isFollowing} onFollow={handleFollow} />
        )}
      </div>
      {profile.bio && (
        <p className="text-gray-600 mt-1 text-center sm:text-left">
          {profile.bio}
        </p>
      )}
    </div>
  );
};

export default UserProfile;
