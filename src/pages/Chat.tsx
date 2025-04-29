import React from "react";
import { ChatList, ChatMessageView, CreateChatGroup } from "../components/chat";
import { useChat, useChatList } from "../hooks";
import { User } from "../types";
import { LucideUsers2 } from "lucide-react";

interface ChatPageProps {
  user: User;
}

const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const {
    conversations,
    groups,
    handleCloseChat,
    handleSelectConversation,
    handleSelectGroupChat,
    handleSendMessage,
    messages,
    selectedUser,
    updateMessages,
    selectedGroup,
    newGroupCreated,
  } = useChat();
  const {
    isModalOpen,
    openModal,
    closeModal,
    friends,
    modalPage,
    updateModalPage,
  } = useChatList({ user });

  return (
    <div className="w-full lg:pl-64 xl:pr-80">
      <div className="flex max-w-2xl mx-auto px-4 pb-4 bg-white relative border-b border-gray-200">
        <div className="font-semibold text-xl px-4 pt-4">Messages</div>
        <div className="justify-end flex-1 flex items-center pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
          >
            <LucideUsers2 />
          </button>
        </div>
      </div>
      {!selectedUser && !selectedGroup ? (
        <ChatList
          user={user}
          conversations={conversations}
          groups={groups}
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          onSelectConversation={handleSelectConversation}
          onSelectGroup={handleSelectGroupChat}
        />
      ) : (
        <ChatMessageView
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          messages={messages}
          updateMessages={updateMessages}
          onSendMessage={handleSendMessage}
          onClose={handleCloseChat}
        />
      )}

      {isModalOpen && (
        <CreateChatGroup
          isOpen={isModalOpen}
          onClose={closeModal}
          users={friends} // Pass the list of users to choose from
          modalPage={modalPage}
          updateModalPage={updateModalPage}
          user={user}
          newGroupCreated={newGroupCreated}
        />
      )}
    </div>
  );
};

export default ChatPage;
