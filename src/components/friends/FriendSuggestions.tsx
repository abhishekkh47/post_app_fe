import React from "react";
import { Loader } from "../common";
import { ProfilePicture } from "../profile";
import { useFriendSuggestions } from "../../hooks";

const FriendSuggestions: React.FC = () => {
  const { friends, loading, handleFriendClick } = useFriendSuggestions();

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Friends List */}
      {loading ? (
        <Loader />
      ) : friends.length > 0 ? (
        <ul className="space-y-3">
          {friends.map((friend: any) => (
            <li
              key={friend._id}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-3 bg-white rounded-lg shadow cursor-pointer"
            >
              <ProfilePicture
                profile_pic={friend?.profile_pic}
                firstName={friend?.firstName || ""}
                size={12}
                text={`lg`}
              />
              <div className="flex-1">
                <span
                  className="font-medium text-gray-800"
                  onClick={() => handleFriendClick(friend._id)}
                >
                  {friend.firstName} {friend.lastName}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No friends found.</p>
      )}
    </div>
  );
};

export default FriendSuggestions;
