import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, UserMinus } from "lucide-react";

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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/get-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = (await response.json())?.data;
        setProfile(data.userDetails);
        setFollowing(data.isFollowing);
        setPublicProfile(data.userDetails?.isPrivate === false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userId, setPublicProfile]);

  // follow and unfollow a user
  const handleFollow = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/follow/${
          following ? "unfollow-user" : "follow-user"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            followerId: user?._id,
            followeeId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow user");
      }

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
          <div className="flex flex-row">
            <div className="flex flex-col pr-4">
              <p className="relative">posts</p>
              <p className="relative">{profile?.posts ?? 0}</p>
            </div>
            <div className="flex flex-col px-4">
              <p className="relative">followers</p>
              <p className="relative">{profile?.followers ?? 0}</p>
            </div>
            <div className="flex flex-col px-4">
              <p className="relative">following</p>
              <p className="relative">{profile?.following ?? 0}</p>
            </div>
          </div>
        </div>
        {user?._id !== profile._id && (
          <button
            onClick={handleFollow}
            className={`mt-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              following
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {following ? (
              <>
                <UserMinus className="h-4 w-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </button>
        )}
      </div>
      {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
    </div>
  );
};
