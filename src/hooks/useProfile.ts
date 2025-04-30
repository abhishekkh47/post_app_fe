import { useState, useEffect } from "react";
import { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { FollowService, UserService } from "../services";

interface ProfileProps {
  userId: string | undefined;
}

const useProfile = ({ userId }: ProfileProps) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [showFriends, setShowFriends] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "followers" | "following" | "posts"
  >("posts");
  const { user, updateUser } = useAuth();

  // get user profile
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
  useEffect(() => {
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

      fetchProfile();
      updateUser();
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
    }
  };

  const updateShowFriends = (status: boolean) => {
    setShowFriends(status);
  };

  const updateActiveTab = (tab: "followers" | "following" | "posts") => {
    setActiveTab(tab);
  };

  return {
    user,
    profile,
    isPublicProfile,
    isFollowing,
    showFriends,
    activeTab,
    setIsPublicProfile,
    setIsFollowing,
    handleFollow,
    updateUser,
    updateShowFriends,
    updateActiveTab,
  };
};

export default useProfile;
