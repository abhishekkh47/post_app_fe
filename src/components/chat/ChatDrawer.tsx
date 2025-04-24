// components/chat/ChatDrawer.tsx

import React, { useState } from "react";
import { ChevronDown, LucideUsers2, MessageCircle } from "lucide-react";
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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Minimized Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center space-x-2"
        >
          <MessageCircle />
        </button>
      )}

      {/* Expanded Drawer */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[700px] flex flex-col transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="font-semibold text-lg">Messages</h2>
            <div>
              <button onClick={openModal}>
                <LucideUsers2 />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <ChevronDown />
              </button>
            </div>
          </div>

          {/* Chat List */}
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
        </div>
      )}

      {/* Chat Popup beside drawer */}
      {(selectedUser || selectedGroup) && (
        <div
          className={`absolute ${
            isOpen ? "right-[340px]" : "right-[70px]"
          } bottom-0`}
        >
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
