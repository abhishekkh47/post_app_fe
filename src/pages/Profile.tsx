import React from "react";
import { UserProfile } from "../components/profile/UserProfile";
import { useParams } from "react-router-dom";

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return <div>User Not Found ...</div>; // Handle the case when user is undefined
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* <UserProfile userId={user._id} /> */}
      <UserProfile userId={userId} />
    </div>
  );
};
