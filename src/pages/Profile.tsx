import React from "react";
import { UserProfile, ProfileFeed } from "../components/profile";
import { useParams } from "react-router-dom";
import { useProfile } from "../hooks";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    isFollowing,
    isPublicProfile,
    user,
    profile,
    handleFollow,
    updateUser,
  } = useProfile({ userId });

  if (!userId) {
    return <div>User Not Found ...</div>;
  }

  return (
    <div className="w-full lg:pl-64 xl:pr-80">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <UserProfile
          user={user}
          profile={profile}
          isFollowing={isFollowing}
          handleFollow={handleFollow}
          updateUser={updateUser}
        />
        {(profile?._id === userId || isPublicProfile || isFollowing) && (
          <div className="py-8">
            <ProfileFeed userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
