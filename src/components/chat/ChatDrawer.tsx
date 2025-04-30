// components/chat/ChatDrawer.tsx

import React, { useState } from "react";
import { LucideUsers2 } from "lucide-react";
import { ChatList, ChatPopup, CreateChatGroup } from "./";
import { useChat, useChatList } from "../../hooks";
import { User } from "../../types";

interface ChatDrawerProps {
  user: User;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    conversations,
    groups,
    selectedUser,
    selectedGroup,
    handleSelectConversation,
    handleSelectGroupChat,
    handleSendMessage,
    handleCloseChat,
    updateMessages,
    messages,
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
    <div className="fixed bottom-4 right-4 z-50 hidden sm:block">
      {/* Minimized Button */}
      <div className="bg-white rounded-lg shadow-xl w-80  flex flex-col transition-all duration-300 ease-in-out">
        <div
          className="flex items-center justify-between p-3 rounded-lg bg-blue-300 rounded-b-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="font-semibold text-lg">Messages</h2>
          <div>
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
        {/* Expanded Drawer */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto">
            <ChatList
              user={user}
              conversations={conversations}
              groups={groups}
              selectedUser={selectedUser}
              selectedGroup={selectedGroup}
              onSelectConversation={handleSelectConversation}
              onSelectGroup={handleSelectGroupChat}
            />
          </div>
        )}
      </div>

      {/* Chat Popup beside drawer */}
      {(selectedUser || selectedGroup) && (
        <div className={`absolute right-[340px] bottom-0`}>
          <ChatPopup
            selectedUser={selectedUser}
            selectedGroup={selectedGroup}
            messages={messages}
            updateMessages={updateMessages}
            onSendMessage={handleSendMessage}
            onClose={handleCloseChat}
          />
        </div>
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

export default ChatDrawer;
