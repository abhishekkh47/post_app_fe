import React, { useEffect, useState } from "react";
import { User, Conversation } from "../../types";
import { LucideUsers2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useChatList } from "../../hooks";
import CreateChatGroup from "./CreateChatGroup";
import { GroupManagement } from ".";
import { FollowService } from "../../services";

interface ChatListProps {
  user: User;
  conversations: Conversation[];
  selectedUser: User | null;
  onSelectConversation: (user: User) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  user,
  conversations,
  selectedUser,
  onSelectConversation,
}) => {
  // const {
  //   isModalOpen,
  //   openModal,
  //   closeModal,
  //   friends,
  //   modalPage,
  //   updateModalPage,
  // } = useChatList({ user });
  const [friends, setFriends] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    updateModalPage(1);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      if (user) {
        const myFriends = await FollowService.getFriends();
        setFriends(myFriends.friends || []);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleGroupChatClick = async () => {
    return CreateChatGroup;
  };

  const updateModalPage = (page: number) => {
    setModalPage(page);
  };

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex flex-row p-4 border-b border-gray-200">
        <h2 className="flex-1 text-xl font-semibold">Messages</h2>
        {/* <GroupManagement users={friends} user={user} /> */}
        <button onClick={openModal}>
          <LucideUsers2 />
        </button>
        <CreateChatGroup
          isOpen={isModalOpen}
          onClose={closeModal}
          users={friends} // Pass the list of users to choose from
          modalPage={modalPage}
          updateModalPage={updateModalPage}
          user={user}
        />
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
            // Only update the selectedUser State when a different user is selected
            onClick={() =>
              selectedUser?._id !== conversation?.userDetails?._id
                ? onSelectConversation(conversation?.userDetails)
                : {}
            }
          >
            <div className="flex items-center space-x-3">
              {conversation.userDetails.profile_pic ? (
                <img
                  src={conversation.userDetails.profile_pic}
                  alt={`${conversation.userDetails.firstName} ${conversation.userDetails.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-lg border border-black">
                  {/* <MessageCircle className="w-6 h-6 text-gray-400" /> */}
                  {conversation.userDetails?.firstName[0]?.toUpperCase()}
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
      </div>
    </div>
  );
};

export default ChatList;
