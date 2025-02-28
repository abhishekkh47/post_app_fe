import { useState, useEffect } from "react";
import { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { FollowService, UserService } from "../services";

interface UserProfileProps {
  userId: string | undefined;
}

const useUserProfile = ({ userId }: UserProfileProps) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
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
        setIsFollowing(data?.isFollowing);
        setIsPublicProfile(data?.userDetails?.isPrivate === false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userId, setIsPublicProfile]);

  // follow and unfollow a user
  const handleFollow = async () => {
    try {
      if (user?._id && userId)
        await FollowService.followOrUnfollowUser(isFollowing, {
          followerId: user?._id,
          followeeId: userId,
        });

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
    }
  };

  return {
    user,
    profile,
    isPublicProfile,
    isFollowing,
    setIsPublicProfile,
    setIsFollowing,
    handleFollow,
  };
};

export default useUserProfile;
