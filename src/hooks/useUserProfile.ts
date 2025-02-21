import { useState, useEffect } from "react";
import { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { FollowService, UserService } from "../services";

interface UserProfileProps {
  userId: string | undefined;
  setPublicProfile: (isPublic: boolean) => void;
  following: boolean;
  setFollowing: (following: boolean) => void;
}

const useUserProfile = ({
  userId,
  setPublicProfile,
  following,
  setFollowing,
}: UserProfileProps) => {
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

  return { user, profile, handleFollow };
};

export default useUserProfile;
