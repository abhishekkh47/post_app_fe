import React from "react";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  following: boolean;
  onFollow: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ following, onFollow }) => {
  return (
    <button
      onClick={onFollow}
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
  );
};

export default FollowButton;
