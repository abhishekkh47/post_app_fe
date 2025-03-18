import React from "react";
// import { UserStats, FollowButton } from "./";
import { Group, User } from "../../types";

interface GroupProfileProps {
  user: User | null;
  groupProfile: Group | null;
  onProfileClick: (userId: string) => void;
  //   isFollowing: boolean;
  //   handleFollow: () => {};
}

const GroupUserList: React.FC<GroupProfileProps> = ({
  user,
  groupProfile,
  onProfileClick,
}) => {
  console.log("user >> ", user);
  console.log("group >> ", groupProfile);
  // const { user, profile, handleFollow, isFollowing } = useUserProfile({
  //   userId,
  // });

  if (!groupProfile) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="font-bold mb-2">Members</div>
      {groupProfile?.members?.length &&
        groupProfile.members.map((member) => {
          return (
            <div>
              <div
                className="flex flex-row items-center space-x-4 p-2 hover:cursor-pointer"
                onClick={() => onProfileClick(member._id)}
              >
                {member?.profile_pic ? (
                  <img
                    src={member.profile_pic}
                    alt={member.firstName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  // <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center text-[50px] border border-black">
                    {member?.firstName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  {member.firstName} {member.lastName}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GroupUserList;
