import React, { useState } from "react";
import { UserProfile } from "../components/profile/UserProfile";
import { useParams } from "react-router-dom";
import { ProfileFeed } from "../components/post/ProfileFeed";
import { useAuth } from "../context/AuthContext";

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  if (!userId) {
    return <div>User Not Found ...</div>; // Handle the case when user is undefined
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* <UserProfile userId={user._id} /> */}
      <UserProfile userId={userId} setPublicProfile={setIsPublicProfile} />
      {(user?._id === userId || isPublicProfile) && (
        <div className="py-8">
          <ProfileFeed userId={userId} />
        </div>
      )}
    </div>
  );
};
