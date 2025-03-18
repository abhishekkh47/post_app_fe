import React from "react";
import { Group, User } from "../../types";

interface GroupProfileProps {
  user: User | null;
  groupProfile: Group | null;
}

const GroupProfile: React.FC<GroupProfileProps> = ({ user, groupProfile }) => {
  if (!groupProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {groupProfile?.profile_pic ? (
          <img
            src={groupProfile.profile_pic}
            alt={groupProfile.name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          // <div className="h-20 w-20 rounded-full bg-gray-200" />
          <div className="h-20 w-20 rounded-full bg-blue-300 flex items-center justify-center text-[50px] border border-black">
            {groupProfile?.name[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{groupProfile?.name}</h2>
          {/* <UserStats
            profile={user?._id !== groupProfile?._id ? groupProfile : user}
          /> */}
        </div>
        {/* {user?._id !== groupProfile._id && (
          <FollowButton following={isFollowing} onFollow={handleFollow} />
        )} */}
      </div>
      {groupProfile.description && (
        <p className="text-gray-600 mt-1">{groupProfile.description}</p>
      )}
    </div>
  );
};

export default GroupProfile;
