import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, UserMinus } from "lucide-react";

interface UserProfileProps {
  userId: string | undefined;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

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
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/follow/${
          isFollowing ? "unfollow-user" : "follow-user"
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

      setIsFollowing(!isFollowing);
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
          <div className="h-20 w-20 rounded-full bg-gray-200" />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
          {user?._id !== profile._id && (
            <button
              onClick={handleFollow}
              className={`mt-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                isFollowing
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isFollowing ? (
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
      </div>
    </div>
  );
};
