import React from "react";
import { ProfilePicture } from "../profile";

interface FriendSuggestionsProps {
  friendSuggestions: any[];
  handleFriendClick: (userId: string) => void;
}

const FriendSuggestions: React.FC<FriendSuggestionsProps> = ({
  friendSuggestions,
  handleFriendClick,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Friends List */}
      <ul className="space-y-3">
        {friendSuggestions.map((friend: any) => (
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
    </div>
  );
};

export default FriendSuggestions;
