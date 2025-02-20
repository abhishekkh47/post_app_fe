import React from "react";
import { ChatList } from "../components/chat/ChatList";
import { ChatPopup } from "../components/chat/ChatPopup";
import { useChat } from "../hooks";

export const ChatPage: React.FC = () => {
  const {
    conversations,
    handleCloseChat,
    handleSelectConversation,
    handleSendMessage,
    messages,
    selectedUser,
    updateMessages,
  } = useChat();

  return (
    <div className="relative h-screen flex">
      <ChatList
        conversations={conversations}
        selectedUser={selectedUser}
        onSelectConversation={handleSelectConversation}
      />
      {/* <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
        onSendMessage={handleSendMessage}
        onBackButtonClick={handleBackButtonClick}
        className="absolute top-0 left-0 w-full h-full z-20"
      /> */}
      <ChatPopup
        selectedUser={selectedUser}
        messages={messages}
        updateMessages={updateMessages}
        onSendMessage={handleSendMessage}
        onClose={handleCloseChat}
      />
    </div>
  );
};
