import React from "react";
import { ChatList, ChatPopup } from "../components/chat";
import { useChat } from "../hooks";
import { User } from "../types";

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
  } = useChat();

  return (
    <div className={`relative h-screen flex`}>
      <ChatList
        user={user}
        conversations={conversations}
        groups={groups}
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        onSelectConversation={handleSelectConversation}
        onSelectGroup={handleSelectGroupChat}
      />
      <ChatPopup
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        messages={messages}
        updateMessages={updateMessages}
        onSendMessage={handleSendMessage}
        onClose={handleCloseChat}
      />
    </div>
  );
};

export default ChatPage;
