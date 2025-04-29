import React from "react";
import { User, Conversation, Group } from "../../types";
import { ProfilePicture } from "../profile";

interface ChatListProps {
  user: User;
  conversations: Conversation[];
  groups: any[];
  selectedUser: User | null;
  selectedGroup: Group | null;
  onSelectConversation: (user: User) => void;
  onSelectGroup: (group: Group) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  user,
  conversations,
  groups,
  selectedUser,
  selectedGroup,
  onSelectConversation,
  onSelectGroup,
}) => {
  return (
    <div className="flex flex-col max-w-2xl mx-auto px-4 bg-white relative">
      <div className="divide-y divide-gray-200">
        {conversations?.map((conversation) => (
          <div
            key={conversation._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUser?._id === conversation.userDetails._id
                ? "bg-gray-300"
                : ""
            }`}
            // Only update the selectedUser State when a different user is selected
            onClick={() =>
              selectedUser?._id !== conversation?.userDetails?._id
                ? onSelectConversation(conversation?.userDetails)
                : {}
            }
          >
            <div className="flex items-center space-x-3">
              <ProfilePicture
                profile_pic={conversation?.userDetails?.profile_pic}
                firstName={conversation?.userDetails?.firstName || ""}
                size={12}
                text={`lg`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {conversation.userDetails.firstName}{" "}
                  {conversation.userDetails.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              </div>
              {!conversation.lastMessage?.isRead &&
                (conversation?.lastMessage?.senderId !== user?._id ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    {conversation?.unreadCount}
                  </div>
                ) : (
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                ))}
            </div>
          </div>
        ))}
        {groups?.map((conversation) => (
          <div
            key={conversation._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedGroup?._id === conversation._id ? "bg-gray-300" : ""
            }`}
            // Only update the selectedGroup State when a different group is selected
            onClick={() =>
              selectedGroup?._id !== conversation._id
                ? onSelectGroup(conversation)
                : {}
            }
          >
            <div className="flex items-center space-x-3">
              <ProfilePicture
                profile_pic={conversation?.profile_pic}
                firstName={conversation?.name || ""}
                size={12}
                text={`lg`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conversation.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {conversation?.lastMessage?.content}
                </p>
              </div>
              {!conversation.lastMessage?.isRead &&
                (conversation?.unreadCount &&
                conversation?.lastMessage?.senderId !== user?._id ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    {conversation?.unreadCount}
                  </div>
                ) : (
                  conversation.lastMessage &&
                  conversation.lastMessage?.senderId === user?._id &&
                  conversation.lastMessage?.readBy?.length <
                    conversation?.members?.length && (
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  )
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
