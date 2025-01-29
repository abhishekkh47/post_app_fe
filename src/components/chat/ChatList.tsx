import React from "react";
import { User, Conversation } from "../../types";
import { MessageCircle } from "lucide-react";

interface ChatListProps {
  conversations: Conversation[];
  selectedUser: User | null;
  onSelectConversation: (user: User) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  selectedUser,
  onSelectConversation,
}) => {
  return (
    <div className="w-full md:w-80 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {conversations?.map((conversation) => (
          <div
            key={conversation._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUser?._id === conversation.userDetails._id
                ? "bg-gray-100"
                : ""
            }`}
            onClick={() => onSelectConversation(conversation.userDetails)}
          >
            <div className="flex items-center space-x-3">
              {conversation.userDetails.profile_pic ? (
                <img
                  src={conversation.userDetails.profile_pic}
                  alt={`${conversation.userDetails.firstName} ${conversation.userDetails.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {conversation.userDetails.firstName}{" "}
                  {conversation.userDetails.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              </div>
              {!conversation.lastMessage.isRead && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
