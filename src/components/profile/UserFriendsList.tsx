import React from "react";
import { ChatPopup } from "../chat";
import { MessageSquare } from "lucide-react";
import { ProfilePicture } from ".";
import { Group, Message, User } from "../../types";

interface UserFriendsListProps {
  friends: User[];
  selectedUser: User | null;
  messages: Message[];
  updateMessages: (newMessage: Message) => void;
  handleFriendClick: (userId: string) => void;
  handleMessageClick: (friend: User, e: React.MouseEvent) => void;
  handleSendMessage: (content: string, attachments?: string[]) => void;
  handleCloseChat: () => void;
  selectedGroup: Group | null;
}

const UserFriendsList: React.FC<UserFriendsListProps> = ({
  friends,
  selectedUser,
  messages,
  updateMessages,
  handleFriendClick,
  handleMessageClick,
  handleSendMessage,
  handleCloseChat,
  selectedGroup,
}) => {
  return (
    <>
      {/* Friends List */}
      <div className="mt-6">
        {friends.length > 0 ? (
          <ul className="space-y-3">
            {friends.map((friend) => (
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
                <button
                  onClick={(e) => {
                    handleMessageClick(friend, e);
                  }} // Open chat popup on "Message"
                  className="ml-auto text-blue-500 hover:text-blue-700"
                >
                  <MessageSquare className="w50 h5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No friends found.</p>
        )}
      </div>
      {/* Conditionally render the ChatPopup if a friend is selected */}
      <div className="fixed bottom-4 right-4 z-50 ">
        {selectedUser && (
          <ChatPopup
            selectedUser={selectedUser}
            messages={messages}
            updateMessages={updateMessages}
            onSendMessage={handleSendMessage}
            onClose={handleCloseChat}
            selectedGroup={selectedGroup}
          />
        )}
      </div>
    </>
  );
};

export default UserFriendsList;
