import React from "react";
import { UserStats, FollowButton } from "./";
import { User } from "../../types";
import { useUserProfile } from "../../hooks";
import config from "../../config";

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
    return <div>Loading profile...</div>;
  }

  const {
    image,
    imagePreview,
    isModalOpen,
    fileInputRef,
    isFileUpdated,
    handleImageClick,
    handleFileChange,
    handleUploadClick,
    handleSaveClick,
    updateSetModalOpen,
  } = useUserProfile({ profile, updateUser });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="relative inline-block" onClick={handleImageClick}>
          {image ? (
            <img
              src={`${config.API_URL}/uploads/${
                user?._id !== profile._id
                  ? profile.profile_pic
                  : user?.profile_pic
              }`}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            // <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div className="h-20 w-20 rounded-full bg-blue-300 flex items-center justify-center text-[50px] border border-black">
              {profile?.firstName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Image Preview Modal */}
        {isModalOpen && imagePreview && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg">
              <button
                onClick={() => updateSetModalOpen(false)}
                className="absolute top-2 right-2 text-xl text-black"
              >
                X
              </button>
              <img
                src={
                  isFileUpdated
                    ? imagePreview
                    : `${config.API_URL}/uploads/${imagePreview}`
                }
                alt="Preview"
                className="w-96 h-96 object-cover rounded-lg"
              />

              {/* Button to trigger file input */}
              <button
                onClick={isFileUpdated ? handleSaveClick : handleUploadClick}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {isFileUpdated ? `Save` : `Upload Image`}
              </button>

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

        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <UserStats profile={user?._id !== profile._id ? profile : user} />
        </div>
        {user?._id !== profile._id && (
          <FollowButton following={isFollowing} onFollow={handleFollow} />
        )}
      </div>
      {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
    </div>
  );
};

export default UserProfile;
