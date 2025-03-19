import React from "react";
import { UserStats, FollowButton } from "./";
import { User } from "../../types";

interface UserProfileProps {
  user: User | null;
  profile: User | null;
  isFollowing: boolean;
  handleFollow: () => {};
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  profile,
  handleFollow,
  isFollowing,
}) => {
  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {profile.profile_pic ? (
          <img
            src={profile.profile_pic}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          // <div className="h-20 w-20 rounded-full bg-gray-200" />
          <div className="h-20 w-20 rounded-full bg-blue-300 flex items-center justify-center text-[50px] border border-black">
            {profile?.firstName[0]?.toUpperCase()}
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
