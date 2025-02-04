import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { UserProfile } from "../components/profile/UserProfile";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User from Profile page: ", user);
    }
  }, [user]);

  if (!user) {
    return <div>User Not Found ...</div>; // Handle the case when user is undefined
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <UserProfile userId={user._id} />
    </div>
  );
};
