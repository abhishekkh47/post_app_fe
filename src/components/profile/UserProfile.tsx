import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { UserStats } from "./UserStats";
import { FollowButton } from "./FollowButton";
import { FollowService, UserService } from "../../services";

interface UserProfileProps {
  userId: string | undefined;
  setPublicProfile: (isPublic: boolean) => void;
  following: boolean;
  setFollowing: (following: boolean) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  setPublicProfile,
  following,
  setFollowing,
}) => {
  const [profile, setProfile] = useState<User | null>(null);
  const { user } = useAuth();

  // get user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data = null;
        if (userId) {
          data = await UserService.fetchUserProfile(userId);
        }
        setProfile(data?.userDetails);
        setFollowing(data?.isFollowing);
        setPublicProfile(data?.userDetails?.isPrivate === false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userId, setPublicProfile]);

  // follow and unfollow a user
  const handleFollow = async () => {
    try {
      if (user?._id && userId)
        await FollowService.followOrUnfollowUser(following, {
          followerId: user?._id,
          followeeId: userId,
        });

      setFollowing(!following);
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
    }
  };

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
            {profile?.firstName[0]}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <UserStats profile={profile} />
        </div>
        {user?._id !== profile._id && (
          <FollowButton following={following} onFollow={handleFollow} />
        )}
      </div>
      {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
    </div>
  );
};
